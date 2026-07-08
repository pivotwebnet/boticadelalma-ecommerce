using BoticaDelAlma.API.Data;
using BoticaDelAlma.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController(BoticaDbContext db, IConfiguration config, EmailService emails) : ControllerBase
{
    [HttpPost("mercadopago-webhook")]
    public async Task<IActionResult> MercadoPagoWebhook([FromQuery] string? topic, [FromQuery] string? id, [FromBody] System.Text.Json.JsonElement body)
    {
        // Mercado Pago envía notificaciones en varios formatos.
        // El formato moderno de Webhook envía en query string: topic=payment e id=[payment_id]
        // O en el body: { "action": "payment.created", "data": { "id": "[payment_id]" }, "type": "payment" }
        
        string? paymentId = id;
        string? resourceType = topic;

        if (string.IsNullOrEmpty(paymentId) && body.ValueKind == System.Text.Json.JsonValueKind.Object)
        {
            if (body.TryGetProperty("type", out var typeProp))
            {
                resourceType = typeProp.GetString();
            }
            if (body.TryGetProperty("data", out var dataProp) && dataProp.TryGetProperty("id", out var idProp))
            {
                paymentId = idProp.GetString();
            }
        }

        // Si la notificación es sobre un pago (payment), procedemos a validar contra la API de Mercado Pago
        if (resourceType == "payment" && !string.IsNullOrEmpty(paymentId))
        {
            var accessToken = config["MercadoPago:AccessToken"];
            if (string.IsNullOrEmpty(accessToken))
            {
                Console.WriteLine("Webhook recibido pero MercadoPago:AccessToken no está configurado.");
                return BadRequest("AccessToken no configurado.");
            }

            try
            {
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

                var res = await client.GetAsync($"https://api.mercadopago.com/v1/payments/{paymentId}");
                if (!res.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error al consultar pago {paymentId} en Mercado Pago: {res.StatusCode}");
                    return Ok(); // Devolvemos 200 para evitar que reintente infinitamente si el ID es inválido
                }

                var responseJson = await res.Content.ReadAsStringAsync();
                using var doc = System.Text.Json.JsonDocument.Parse(responseJson);
                var root = doc.RootElement;

                // Extraer el external_reference y el status del pago
                string? externalRef = null;
                string? status = null;

                if (root.TryGetProperty("external_reference", out var extProp))
                {
                    externalRef = extProp.GetString();
                }
                if (root.TryGetProperty("status", out var statusProp))
                {
                    status = statusProp.GetString();
                }

                if (!string.IsNullOrEmpty(externalRef) && Guid.TryParse(externalRef, out Guid orderId))
                {
                    if (status == "approved")
                    {
                        var order = await db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == orderId);
                        if (order != null && order.Status == "pending")
                        {
                            order.Status = "paid";
                            order.UpdatedAt = DateTime.UtcNow;
                            await db.SaveChangesAsync();
                            Console.WriteLine($"Orden #{orderId} marcada como PAGADA con éxito vía Webhook de Mercado Pago.");

                            // Enviar mail de confirmación de pago en segundo plano
                            _ = Task.Run(async () =>
                            {
                                try
                                {
                                    await emails.SendPaymentConfirmationAsync(order);
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"Error al enviar mail de pago en segundo plano: {ex.Message}");
                                }
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Excepción al procesar webhook de Mercado Pago: {ex.Message}");
                return StatusCode(500); // 500 para que Mercado Pago reintente si hubo un error transitorio
            }
        }

        // Siempre responder 200/Ok a Mercado Pago para confirmar recepción
        return Ok();
    }
}
