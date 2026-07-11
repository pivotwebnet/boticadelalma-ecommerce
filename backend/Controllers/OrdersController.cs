using BoticaDelAlma.API.Attributes;
using BoticaDelAlma.API.Data;
using BoticaDelAlma.API.DTOs;
using BoticaDelAlma.API.Models;
using BoticaDelAlma.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(BoticaDbContext db, IConfiguration config, EmailService emails) : ControllerBase
{
    private static readonly string[] ValidStatuses = ["pending", "paid", "shipped", "cancelled"];

    // Máquina de estados: desde cada estado, a qué estados se puede pasar.
    private static readonly Dictionary<string, string[]> AllowedTransitions = new()
    {
        ["pending"]   = ["paid", "cancelled"],
        ["paid"]      = ["shipped", "cancelled"],
        ["shipped"]   = [],            // entregado: estado final
        ["cancelled"] = [],            // cancelado: estado final
    };

    [HttpGet]
    [RequireAdminKey]
    public async Task<IActionResult> GetAll()
    {
        var orders = await db.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => MapToResponse(o))
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id:guid}")]
    [RequireAdminKey]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null) return NotFound();
        return Ok(MapToResponse(order));
    }

    [HttpGet("public/{id:guid}")]
    public async Task<IActionResult> GetPublicById(Guid id)
    {
        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null) return NotFound();
        return Ok(MapToResponse(order));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        if (dto.Items is null || dto.Items.Count == 0)
            return BadRequest("La orden debe tener al menos un producto.");

        // Cantidad total por producto (por si el mismo producto viene en varias líneas).
        var qtyByProduct = dto.Items
            .GroupBy(i => i.ProductId)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.Quantity));

        var ids = qtyByProduct.Keys.ToList();
        var products = await db.Products
            .Where(p => ids.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        var items = new List<OrderItem>();

        foreach (var (productId, totalQty) in qtyByProduct)
        {
            if (totalQty < 1)
                return BadRequest("La cantidad debe ser al menos 1.");

            if (!products.TryGetValue(productId, out var product))
                return BadRequest($"El producto '{productId}' no existe.");

            if (!product.IsActive)
                return BadRequest($"El producto '{product.Name}' no está disponible.");

            if (product.Stock < totalQty)
                return BadRequest($"Stock insuficiente para '{product.Name}'. Disponible: {product.Stock}.");
        }

        // Construye los ítems con el precio y nombre REALES de la base de datos.
        foreach (var dtoItem in dto.Items)
        {
            var product = products[dtoItem.ProductId];
            items.Add(new OrderItem
            {
                ProductId   = product.Id,
                ProductName = product.Name,
                PricePaid   = product.Price,
                Quantity    = dtoItem.Quantity,
            });
        }

        // El estado inicial SOLO lo puede fijar el panel admin (ventas manuales ya
        // cobradas). El checkout público SIEMPRE nace "pending": nadie puede marcar
        // su propia orden como pagada/enviada sin pagar (anti-manipulación, igual
        // que con los precios). Un status enviado por un cliente público se ignora.
        var status = "pending";
        if (!string.IsNullOrEmpty(dto.Status) && IsAdminRequest())
        {
            if (!ValidStatuses.Contains(dto.Status))
                return BadRequest($"Estado inválido. Válidos: {string.Join(", ", ValidStatuses)}");
            // Una venta nueva solo tiene sentido naciendo pendiente o cobrada.
            if (dto.Status is not ("pending" or "paid"))
                return BadRequest("Una venta nueva solo puede iniciar como pendiente o pagada.");
            status = dto.Status;
        }

        var order = new Order
        {
            CustomerName  = dto.CustomerName,
            CustomerEmail = dto.CustomerEmail,
            CustomerPhone = dto.CustomerPhone,
            Address       = dto.Address,
            City          = dto.City,
            Notes         = dto.Notes,
            Status        = status,
            Items         = items,
        };

        order.Total = order.Items.Sum(i => i.PricePaid * i.Quantity);

        // Descuento de stock ATÓMICO dentro de una transacción. El UPDATE condicional
        // (Stock >= cantidad) y el bloqueo de fila evitan la sobreventa cuando dos
        // compras simultáneas pelean por la última unidad: solo una gana el descuento.
        // Se recorren los productos en orden de Id para evitar deadlocks.
        await using var tx = await db.Database.BeginTransactionAsync();

        foreach (var (productId, totalQty) in qtyByProduct.OrderBy(kv => kv.Key))
        {
            var affected = await db.Products
                .Where(p => p.Id == productId && p.Stock >= totalQty)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.Stock, p => p.Stock - totalQty));

            if (affected == 0)
            {
                await tx.RollbackAsync();
                return Conflict($"Se agotó el stock de '{products[productId].Name}' mientras se procesaba la compra. Revisá la disponibilidad e intentá de nuevo.");
            }
        }

        db.Orders.Add(order);
        await db.SaveChangesAsync();
        await tx.CommitAsync();

        // Enviar mail de confirmación asíncronamente en segundo plano
        _ = Task.Run(async () =>
        {
            try
            {
                await emails.SendOrderConfirmationAsync(order);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar mail en segundo plano: {ex.Message}");
            }
        });

        var initPoint = await TryGenerateMercadoPagoPreference(order);
        var response = MapToResponse(order) with { InitPoint = initPoint };

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, response);
    }

    [HttpPatch("{id:guid}/status")]
    [RequireAdminKey]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
    {
        if (!ValidStatuses.Contains(dto.Status))
            return BadRequest($"Estado inválido. Válidos: {string.Join(", ", ValidStatuses)}");

        var order = await db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order is null) return NotFound();

        if (order.Status == dto.Status)
            return NoContent(); // sin cambios

        if (!AllowedTransitions.TryGetValue(order.Status, out var allowed) || !allowed.Contains(dto.Status))
            return BadRequest($"No se puede cambiar el estado de '{order.Status}' a '{dto.Status}'.");

        // Al cancelar, se repone el stock de los productos de la orden.
        if (dto.Status == "cancelled")
        {
            var ids = order.Items.Select(i => i.ProductId).ToList();
            var products = await db.Products.Where(p => ids.Contains(p.Id)).ToDictionaryAsync(p => p.Id);
            foreach (var item in order.Items)
                if (products.TryGetValue(item.ProductId, out var p))
                    p.Stock += item.Quantity;
        }

        order.Status = dto.Status;
        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return NoContent();
    }

    // ¿La petición trae una X-Admin-Key válida? En dev (AdminApiKey sin configurar)
    // no hay forma de distinguir admin de público, así que se considera admin —
    // coherente con el modo "sin seguridad" documentado para desarrollo.
    private bool IsAdminRequest()
    {
        var expected = config["AdminApiKey"];
        if (string.IsNullOrEmpty(expected)) return true;
        var provided = Request.Headers[RequireAdminKeyAttribute.HeaderName].ToString();
        if (provided.Length != expected.Length) return false;
        var diff = 0;
        for (var i = 0; i < provided.Length; i++) diff |= provided[i] ^ expected[i];
        return diff == 0;
    }

    private async Task<string?> TryGenerateMercadoPagoPreference(Order order)
    {
        var accessToken = config["MercadoPago:AccessToken"];
        if (string.IsNullOrEmpty(accessToken)) return null;

        try
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var siteUrl = config["SiteUrl"] ?? "http://localhost:3000";

            var payload = new
            {
                items = order.Items.Select(i => new
                {
                    title = i.ProductName,
                    unit_price = (double)i.PricePaid,
                    quantity = i.Quantity,
                    currency_id = "ARS"
                }).ToList(),
                payer = new
                {
                    name = order.CustomerName,
                    email = order.CustomerEmail
                },
                back_urls = new
                {
                    success = $"{siteUrl}/carrito?status=success&orderId={order.Id}",
                    failure = $"{siteUrl}/carrito?status=failure&orderId={order.Id}",
                    pending = $"{siteUrl}/carrito?status=pending&orderId={order.Id}"
                },
                auto_return = "approved",
                external_reference = order.Id.ToString(),
                // El webhook entra por el frontend público (Next.js lo reenvía al backend).
                // Así funciona aunque el backend .NET esté en red interna (ver CONTEXTO.md).
                notification_url = $"{siteUrl}/api/payments/mercadopago-webhook"
            };

            var json = System.Text.Json.JsonSerializer.Serialize(payload);
            using var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var res = await client.PostAsync("https://api.mercadopago.com/checkout/preferences", content);
            if (!res.IsSuccessStatusCode)
            {
                var errContent = await res.Content.ReadAsStringAsync();
                Console.WriteLine($"Error al crear preferencia de Mercado Pago: {res.StatusCode} - {errContent}");
                return null;
            }

            var responseJson = await res.Content.ReadAsStringAsync();
            using var doc = System.Text.Json.JsonDocument.Parse(responseJson);
            if (doc.RootElement.TryGetProperty("init_point", out var initPointProp))
            {
                return initPointProp.GetString();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Excepción al conectar con Mercado Pago: {ex.Message}");
        }

        return null;
    }

    private static OrderResponseDto MapToResponse(Order o) => new(
        o.Id, o.Status, o.Total,
        o.CustomerName, o.CustomerEmail, o.CustomerPhone,
        o.Address, o.City, o.Notes,
        o.CreatedAt, o.UpdatedAt,
        o.Items.Select(i => new OrderItemResponseDto(
            i.Id, i.ProductId, i.ProductName, i.PricePaid, i.Quantity
        )).ToList()
    );
}
