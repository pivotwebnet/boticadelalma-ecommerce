using System.Text.Json;
using System.Text.RegularExpressions;
using BoticaDelAlma.API.Attributes;
using BoticaDelAlma.API.Data;
using BoticaDelAlma.API.DTOs;
using BoticaDelAlma.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public partial class ProductsController(BoticaDbContext db) : ControllerBase
{
    // slug: minúsculas, números y guiones (sin espacios ni acentos).
    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    private static partial Regex SlugRegex();

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? categoryId,
        [FromQuery] string? search,
        [FromQuery] string? material,
        [FromQuery] string? intention,
        [FromQuery] bool?   isNew,
        [FromQuery] int?    minPrice,
        [FromQuery] int?    maxPrice,
        [FromQuery] string? sortBy,
        [FromQuery] bool    includeInactive = false)
    {
        var q = db.Products
            .Include(p => p.Category)
            .AsQueryable();

        // El catálogo público solo muestra activos; el panel admin pide includeInactive=true.
        if (!includeInactive)
            q = q.Where(p => p.IsActive);

        if (!string.IsNullOrEmpty(categoryId))
            q = q.Where(p => p.CategoryId == categoryId);

        if (!string.IsNullOrEmpty(search))
            q = q.Where(p => p.Name.ToLower().Contains(search.ToLower()));

        // Tags es un JSON array guardado como string — la búsqueda parcial es suficiente
        // porque el frontend envía los valores exactos del MATERIALS/INTENTIONS array.
        if (!string.IsNullOrEmpty(material))
            q = q.Where(p => p.Tags.ToLower().Contains(material.ToLower()));

        if (!string.IsNullOrEmpty(intention))
            q = q.Where(p => p.Tags.ToLower().Contains(intention.ToLower()));

        if (isNew.HasValue)
            q = q.Where(p => p.IsNew == isNew.Value);

        if (minPrice.HasValue)
            q = q.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            q = q.Where(p => p.Price <= maxPrice.Value);

        q = sortBy switch
        {
            "price-asc"  => q.OrderBy(p => p.Price),
            "price-desc" => q.OrderByDescending(p => p.Price),
            "newest"     => q.OrderByDescending(p => p.CreatedAt),
            "rating"     => q.OrderByDescending(p => p.Rating),
            "name"       => q.OrderBy(p => p.Name),
            _            => q.OrderBy(p => p.CategoryId).ThenBy(p => p.Name),
        };

        var products = await q.ToListAsync();
        return Ok(products.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, [FromQuery] bool includeInactive = false)
    {
        var p = await db.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && (includeInactive || p.IsActive));

        if (p is null) return NotFound();
        return Ok(MapToDto(p));
    }

    [HttpPost]
    [RequireAdminKey]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!SlugRegex().IsMatch(dto.Id))
            return BadRequest("El ID debe ser un slug: solo minúsculas, números y guiones (ej: 'anillo-luna').");

        if (!await db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            return BadRequest($"La categoría '{dto.CategoryId}' no existe.");

        if (await db.Products.AnyAsync(p => p.Id == dto.Id))
            return Conflict($"Ya existe un producto con ID '{dto.Id}'.");

        var priceError = ValidatePricing(dto.Price, dto.OriginalPrice, dto.Stock);
        if (priceError is not null) return BadRequest(priceError);

        var imagesError = ValidateImages(dto.Images);
        if (imagesError is not null) return BadRequest(imagesError);
        var images = dto.Images ?? [];

        var product = new Product
        {
            Id            = dto.Id,
            Name          = dto.Name,
            CategoryId    = dto.CategoryId,
            Price         = dto.Price,
            OriginalPrice = dto.OriginalPrice,
            Tone          = dto.Tone ?? "sage",
            Label         = dto.Label ?? string.Empty,
            Tags          = JsonSerializer.Serialize(dto.Tags ?? []),
            IsNew         = dto.IsNew,
            // La portada (ImageUrl) es la primera foto de la galería, si hay.
            ImageUrl      = images.Length > 0 ? images[0] : dto.ImageUrl,
            Images        = JsonSerializer.Serialize(images),
            Stock         = dto.Stock,
        };

        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, MapToDto(product));
    }

    [HttpPut("{id}")]
    [RequireAdminKey]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateProductDto dto)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();

        if (dto.CategoryId is not null && !await db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            return BadRequest($"La categoría '{dto.CategoryId}' no existe.");

        // Valida la combinación final de precio/original/stock.
        var finalPrice    = dto.Price ?? product.Price;
        var finalOriginal = dto.OriginalPrice;
        var finalStock    = dto.Stock ?? product.Stock;
        var priceError    = ValidatePricing(finalPrice, finalOriginal, finalStock);
        if (priceError is not null) return BadRequest(priceError);

        var imagesError = ValidateImages(dto.Images);
        if (imagesError is not null) return BadRequest(imagesError);

        if (dto.Name        is not null) product.Name        = dto.Name;
        if (dto.CategoryId  is not null) product.CategoryId  = dto.CategoryId;
        if (dto.Price.HasValue)          product.Price        = dto.Price.Value;
        product.OriginalPrice = dto.OriginalPrice;
        if (dto.Tone        is not null) product.Tone        = dto.Tone;
        if (dto.Label       is not null) product.Label       = dto.Label;
        if (dto.Tags        is not null) product.Tags        = JsonSerializer.Serialize(dto.Tags);
        if (dto.Images      is not null)
        {
            product.Images   = JsonSerializer.Serialize(dto.Images);
            // La portada sigue a la galería: primera foto, o null si quedó vacía.
            product.ImageUrl = dto.Images.Length > 0 ? dto.Images[0] : null;
        }
        else if (dto.ImageUrl is not null)
        {
            product.ImageUrl = dto.ImageUrl == "" ? null : dto.ImageUrl;
        }
        if (dto.IsNew.HasValue)          product.IsNew       = dto.IsNew.Value;
        if (dto.IsActive.HasValue)       product.IsActive    = dto.IsActive.Value;
        if (dto.Stock.HasValue)          product.Stock       = dto.Stock.Value;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("bulk-price")]
    [RequireAdminKey]
    public async Task<IActionResult> BulkPrice([FromBody] BulkPriceDto dto)
    {
        if (dto.ProductIds is null || dto.ProductIds.Length == 0)
            return BadRequest("Elegí al menos un producto.");
        if (dto.Mode is not ("discount" or "increase"))
            return BadRequest("Modo inválido.");
        if (dto.Percent < 1)
            return BadRequest("El porcentaje debe ser mayor a 0.");
        if (dto.Mode == "discount" && dto.Percent >= 100)
            return BadRequest("Un descuento debe ser menor al 100%.");

        var products = await db.Products
            .Where(p => dto.ProductIds.Contains(p.Id))
            .ToListAsync();
        if (products.Count == 0)
            return BadRequest("No se encontraron los productos indicados.");

        var factor = dto.Percent / 100.0;
        foreach (var p in products)
        {
            if (dto.Mode == "discount")
            {
                // El "precio de lista" es el OriginalPrice si ya estaba en oferta,
                // o el precio actual. El descuento se calcula siempre sobre la lista,
                // así aplicar el % dos veces no encadena rebajas raras.
                var listPrice = p.OriginalPrice is int op && op > p.Price ? op : p.Price;
                var newPrice = (int)Math.Round(listPrice * (1 - factor));
                if (newPrice < 1) newPrice = 1;
                if (newPrice < listPrice)
                {
                    p.OriginalPrice = listPrice; // queda tachado en la tienda
                    p.Price = newPrice;
                }
            }
            else // increase
            {
                var newPrice = (int)Math.Round(p.Price * (1 + factor));
                if (newPrice < 1) newPrice = 1;
                p.Price = newPrice;
                // Si el aumento alcanza/supera el precio de lista, ya no es oferta.
                if (p.OriginalPrice is int op && op <= newPrice)
                    p.OriginalPrice = null;
            }
            p.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
        return Ok(new { updated = products.Count });
    }

    [HttpDelete("{id}")]
    [RequireAdminKey]
    public async Task<IActionResult> Delete(string id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();

        // Si el producto tiene historial de ventas, NO se borra (rompería las órdenes):
        // se desactiva (soft-delete) para conservar el historial.
        var hasOrderHistory = await db.OrderItems.AnyAsync(oi => oi.ProductId == id);
        if (hasOrderHistory)
        {
            product.IsActive = false;
            product.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Ok(new { softDeleted = true, message = "El producto tiene ventas registradas, se desactivó en lugar de eliminarse." });
        }

        // Sin historial: borrado real, limpiando sus reseñas huérfanas.
        var comments = db.Comments.Where(c => c.ProductId == id);
        db.Comments.RemoveRange(comments);
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return Ok(new { softDeleted = false });
    }

    // Devuelve un mensaje de error o null si la combinación es válida.
    private static string? ValidatePricing(int price, int? originalPrice, int stock)
    {
        if (price < 0) return "El precio no puede ser negativo.";
        if (stock < 0) return "El stock no puede ser negativo.";
        if (originalPrice.HasValue && originalPrice.Value <= price)
            return "El precio original (tachado) debe ser mayor que el precio actual.";
        return null;
    }

    // Regla de las fotos: hasta 6 y ninguna vacía. Así la web muestra solo las
    // que de verdad se cargaron (nada de slots en blanco). Null = no se tocaron.
    private const int MaxImages = 6;
    private static string? ValidateImages(string[]? images)
    {
        if (images is null) return null;
        if (images.Length > MaxImages)
            return $"Se permiten hasta {MaxImages} fotos por producto.";
        if (images.Any(string.IsNullOrWhiteSpace))
            return "No se permiten fotos vacías: se guardan solo las que realmente cargaste.";
        return null;
    }

    private static ProductResponseDto MapToDto(Product p)
    {
        string[] tags;
        try   { tags = JsonSerializer.Deserialize<string[]>(p.Tags) ?? []; }
        catch { tags = []; }

        string[] images;
        try   { images = JsonSerializer.Deserialize<string[]>(p.Images) ?? []; }
        catch { images = []; }
        // Defensa extra: nunca devolver entradas vacías a la tienda.
        images = images.Where(s => !string.IsNullOrWhiteSpace(s)).ToArray();

        return new ProductResponseDto(
            p.Id, p.Name, p.CategoryId, p.Category?.Name,
            p.Price, p.OriginalPrice, p.Tone, p.Label, tags,
            p.IsNew, p.IsActive, p.Rating, p.Reviews,
            p.ImageUrl, images, p.Stock, p.CreatedAt, p.UpdatedAt,
            p.Code, p.Provider, p.ProductType, p.Stone, p.CostPrice, p.MinStock);
    }

    // Importación masiva desde la planilla de stock (Excel/Google Sheets) de la dueña.
    // Matchea por Código: si existe lo actualiza, si no lo crea. Crea categorías que falten.
    [HttpPost("import")]
    [RequireAdminKey]
    public async Task<IActionResult> Import([FromBody] List<ImportProductRowDto> rows)
    {
        if (rows is null || rows.Count == 0)
            return BadRequest("No se recibieron filas para importar.");

        var errors = new List<string>();
        int created = 0, updated = 0, categoriesCreated = 0;

        var categories = await db.Categories.ToListAsync();
        var existingProducts = await db.Products.ToDictionaryAsync(p => p.Code ?? p.Id, p => p);

        // IDs (slugs) ya ocupados. Incluye los productos existentes y los que se van creando
        // en este mismo lote, para que dos filas con nombres parecidos no generen el mismo Id
        // (EF Core no puede trackear dos entidades con la misma clave y se caería toda la importación).
        var usedIds = new HashSet<string>(existingProducts.Values.Select(p => p.Id), StringComparer.OrdinalIgnoreCase);

        foreach (var row in rows)
        {
            if (string.IsNullOrWhiteSpace(row.Code) || string.IsNullOrWhiteSpace(row.Name))
            {
                errors.Add($"Fila sin código o nombre válido, se omitió.");
                continue;
            }
            if (string.IsNullOrWhiteSpace(row.CategoryName))
            {
                errors.Add($"'{row.Name}' ({row.Code}): sin categoría, se omitió.");
                continue;
            }

            var category = categories.FirstOrDefault(c =>
                string.Equals(c.Name, row.CategoryName, StringComparison.OrdinalIgnoreCase));
            if (category is null)
            {
                var categoryId = Slugify(row.CategoryName);
                category = new Category
                {
                    Id = categoryId,
                    Name = row.CategoryName.Trim(),
                    SortOrder = categories.Count + 1,
                };
                db.Categories.Add(category);
                categories.Add(category);
                categoriesCreated++;
            }

            if (existingProducts.TryGetValue(row.Code, out var product))
            {
                product.Name        = row.Name.Trim();
                product.CategoryId  = category.Id;
                product.Price       = row.Price;
                product.Stock       = row.Stock;
                product.Provider    = row.Provider;
                product.ProductType = row.ProductType;
                product.Stone       = row.Stone;
                product.CostPrice   = row.CostPrice;
                product.MinStock    = row.MinStock;
                product.UpdatedAt   = DateTime.UtcNow;
                updated++;
            }
            else
            {
                var id = UniqueSlug(row.Name, row.Code, usedIds);
                product = new Product
                {
                    Id          = id,
                    Code        = row.Code.Trim(),
                    Name        = row.Name.Trim(),
                    CategoryId  = category.Id,
                    Price       = row.Price,
                    Stock       = row.Stock,
                    Provider    = row.Provider,
                    ProductType = row.ProductType,
                    Stone       = row.Stone,
                    CostPrice   = row.CostPrice,
                    MinStock    = row.MinStock,
                    // Nuevo producto sin fotos todavía: queda inactivo hasta que se le
                    // carguen imágenes a mano en el panel, para no mostrar un producto vacío.
                    IsActive    = false,
                };
                db.Products.Add(product);
                existingProducts[row.Code] = product;
                created++;
            }
        }

        await db.SaveChangesAsync();
        return Ok(new ImportResultDto(created, updated, categoriesCreated, errors.ToArray()));
    }

    private static string Slugify(string text)
    {
        var slug = text.Trim().ToLowerInvariant();
        slug = Regex.Replace(slug, "[áàä]", "a");
        slug = Regex.Replace(slug, "[éèë]", "e");
        slug = Regex.Replace(slug, "[íìï]", "i");
        slug = Regex.Replace(slug, "[óòö]", "o");
        slug = Regex.Replace(slug, "[úùü]", "u");
        slug = Regex.Replace(slug, "ñ", "n");
        slug = Regex.Replace(slug, "[^a-z0-9]+", "-").Trim('-');
        return string.IsNullOrEmpty(slug) ? Guid.NewGuid().ToString("N")[..8] : slug;
    }

    // Genera un Id (slug) único a partir del nombre, evitando choques tanto con la base
    // como con los productos ya generados en el mismo lote (usedIds se actualiza en el acto).
    private static string UniqueSlug(string name, string code, HashSet<string> usedIds)
    {
        var baseSlug = Slugify(name);
        if (string.IsNullOrEmpty(baseSlug)) baseSlug = Slugify(code);
        // La columna Id es varchar(50); recortamos dejando margen para el sufijo de unicidad.
        if (baseSlug.Length > 45) baseSlug = baseSlug[..45].TrimEnd('-');
        var slug = baseSlug;
        var suffix = 2;
        while (usedIds.Contains(slug))
        {
            slug = $"{baseSlug}-{suffix}";
            suffix++;
        }
        usedIds.Add(slug);
        return slug;
    }
}
