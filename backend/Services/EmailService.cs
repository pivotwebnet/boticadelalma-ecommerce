using BoticaDelAlma.API.Models;
using System.Text;
using System.Text.Json;

namespace BoticaDelAlma.API.Services;

public class EmailService(IConfiguration config)
{
    private readonly string? _apiKey = config["Resend:ApiKey"];
    private readonly string _fromEmail = config["Resend:FromEmail"] ?? "La Botica del Alma <onboarding@resend.dev>";
    private readonly string? _adminEmail = config["Resend:AdminEmail"] ?? "laboticadelalma1@gmail.com";

    public async Task SendOrderConfirmationAsync(Order order)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            Console.WriteLine($"[EMAIL MOCK] Confirmación de Pedido para {order.CustomerEmail} (Orden #{order.Id.ToString()[..8]}) no enviada. Resend:ApiKey no configurada.");
            return;
        }

        var isTransfer = order.Status == "pending";
        var subject = $"Tu pedido #{order.Id.ToString()[..8]} - La Botica del Alma";

        var htmlBuilder = new StringBuilder();
        htmlBuilder.Append($@"
        <div style=""font-family: 'Georgia', serif; background-color: #fcfbf9; padding: 40px 20px; color: #2e2d2c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eae6e1; border-radius: 8px;"">
            <!-- Header -->
            <div style=""text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eae6e1; padding-bottom: 20px;"">
                <span style=""font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #8fa27b; font-weight: bold; display: block; margin-bottom: 5px;"">Piezas Sagradas & Cristales</span>
                <h1 style=""font-style: italic; font-weight: normal; font-size: 28px; margin: 0; color: #2e2d2c;"">La Botica del Alma</h1>
            </div>

            <!-- Saludo -->
            <div style=""margin-bottom: 30px;"">
                <p style=""font-size: 16px;"">Hola <strong>{order.CustomerName}</strong>,</p>
                <p style=""font-size: 14.5px; color: #5a5957;"">Muchas gracias por conectar con nuestro espacio y elegir nuestras piezas sagradas. Hemos registrado tu pedido <strong>#{order.Id.ToString()[..8]}</strong> con éxito y ya está guardado en nuestro sistema.</p>
            </div>

            <!-- Tabla de Ítems -->
            <div style=""margin-bottom: 30px;"">
                <h3 style=""font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #8fa27b; border-bottom: 1px solid #eae6e1; padding-bottom: 8px; margin-bottom: 12px;"">Detalle del Pedido</h3>
                <table style=""width: 100%; border-collapse: collapse; font-size: 13.5px;"">
                    <thead>
                        <tr style=""border-bottom: 1px solid #eae6e1; text-align: left; color: #888;"">
                            <th style=""padding: 8px 0; font-weight: normal;"">Producto</th>
                            <th style=""padding: 8px 0; font-weight: normal; text-align: center; width: 60px;"">Cant.</th>
                            <th style=""padding: 8px 0; font-weight: normal; text-align: right; width: 90px;"">Precio</th>
                        </tr>
                    </thead>
                    <tbody>");

        foreach (var item in order.Items)
        {
            htmlBuilder.Append($@"
                        <tr style=""border-bottom: 1px solid #f2efeb;"">
                            <td style=""padding: 10px 0;"">{item.ProductName}</td>
                            <td style=""padding: 10px 0; text-align: center;"">{item.Quantity}</td>
                            <td style=""padding: 10px 0; text-align: right;"">${item.PricePaid * item.Quantity}</td>
                        </tr>");
        }

        htmlBuilder.Append($@"
                    </tbody>
                </table>
                <div style=""text-align: right; margin-top: 15px; font-size: 16px; font-weight: bold; color: #2e2d2c;"">
                    Total: ${order.Total}
                </div>
            </div>");

        // Sección específica de pago
        if (isTransfer)
        {
            var banco = config["Tienda:Banco"] ?? "Banco Credicoop";
            var cbu = config["Tienda:Cbu"] ?? "1910274855027402770274";
            var alias = config["Tienda:Alias"] ?? "botica.del.alma";
            var titular = config["Tienda:Titular"] ?? "Botica del Alma S.H.";

            htmlBuilder.Append($@"
            <!-- Pago por Transferencia -->
            <div style=""background-color: #f7f6f2; border: 1.5px solid #c9a17a; border-radius: 6px; padding: 20px; margin-bottom: 30px;"">
                <h4 style=""margin-top: 0; color: #c9a17a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;"">Coordinar Transferencia Bancaria</h4>
                <p style=""font-size: 13.5px; margin-bottom: 15px; color: #5a5957;"">Tu orden está <strong>pendiente de pago</strong>. Para concretar tu compra, realizá la transferencia por el total de <strong>${order.Total}</strong> a la siguiente cuenta:</p>
                <div style=""font-family: monospace; font-size: 13px; color: #2e2d2c; line-height: 1.8;"">
                    <strong>Titular:</strong> {titular}<br/>
                    <strong>Banco:</strong> {banco}<br/>
                    <strong>CBU:</strong> {cbu}<br/>
                    <strong>Alias:</strong> {alias}
                </div>
                <p style=""font-size: 12.5px; margin-top: 15px; font-style: italic; color: #888;"">Por favor, una vez hecha la transferencia, respondé a este correo adjuntando el comprobante o envialo por WhatsApp.</p>
            </div>");
        }
        else
        {
            htmlBuilder.Append($@"
            <!-- Pago con Tarjeta / Mercado Pago -->
            <div style=""background-color: #f2f5f1; border: 1.5px solid #8fa27b; border-radius: 6px; padding: 20px; margin-bottom: 30px;"">
                <h4 style=""margin-top: 0; color: #8fa27b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;"">Pago Confirmado</h4>
                <p style=""font-size: 13.5px; margin: 0; color: #5a5957;"">¡Excelente! Hemos recibido el pago de tu orden con éxito a través de Mercado Pago. Ya nos encontramos preparando tus piezas sagradas para despacharlas a la brevedad.</p>
            </div>");
        }

        // Footer e Información de Envío
        var whatsappText = Uri.EscapeDataString($"¡Hola! Necesito coordinar el envío de mi pedido #{order.Id.ToString()[..8]}.");
        htmlBuilder.Append($@"
            <!-- Envíos -->
            <div style=""margin-bottom: 30px; font-size: 13.5px; color: #5a5957;"">
                <h4 style=""margin-top: 0; color: #2e2d2c; font-size: 14px; margin-bottom: 8px;"">Detalles de Envío</h4>
                <p style=""margin: 0;""><strong>Dirección:</strong> {order.Address ?? "Retira en Rafaela sin cargo"}</p>
                <p style=""margin: 4px 0 0 0;""><strong>Ciudad:</strong> {order.City ?? "Rafaela"}</p>
                {(!string.IsNullOrEmpty(order.Notes) ? $"<p style=\"margin: 4px 0 0 0;\"><strong>Notas:</strong> {order.Notes}</p>" : "")}
            </div>

            <!-- CTA -->
            <div style=""text-align: center; margin-top: 40px; border-top: 1px solid #eae6e1; padding-top: 25px;"">
                <a href=""https://wa.me/5493492274535?text={whatsappText}"" style=""display: inline-block; background-color: #8fa27b; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; font-family: 'Helvetica', sans-serif; transition: background-color 0.2s;"">
                    Coordinar Envío por WhatsApp
                </a>
                <p style=""font-size: 12px; color: #888; margin-top: 15px;"">¿Tuviste algún problema o querés realizar un cambio? Escribinos en cualquier momento.</p>
            </div>
        </div>");

        await SendEmailAsync(order.CustomerEmail, subject, htmlBuilder.ToString());

        // Enviar copia silenciosa a la administradora para notificarle de la venta nueva
        if (!string.IsNullOrEmpty(_adminEmail))
        {
            var adminSubject = $"[Nueva Venta Web] Orden #{order.Id.ToString()[..8]} - ${order.Total}";
            var adminHtml = $@"
            <div style=""font-family: sans-serif; padding: 20px; color: #333;"">
                <h2>¡Felicitaciones! Recibiste un nuevo pedido web.</h2>
                <p><strong>Cliente:</strong> {order.CustomerName} ({order.CustomerEmail})</p>
                <p><strong>Total:</strong> ${order.Total}</p>
                <p><strong>Estado:</strong> {order.Status}</p>
                <p>Ingresá al panel de administración para ver el detalle y despacharlo.</p>
            </div>";
            await SendEmailAsync(_adminEmail, adminSubject, adminHtml);
        }
    }

    public async Task SendPaymentConfirmationAsync(Order order)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            Console.WriteLine($"[EMAIL MOCK] Confirmación de Pago para {order.CustomerEmail} (Orden #{order.Id.ToString()[..8]}) no enviada.");
            return;
        }

        var subject = $"Confirmamos tu pago - Orden #{order.Id.ToString()[..8]} - La Botica del Alma";
        var html = $@"
        <div style=""font-family: 'Georgia', serif; background-color: #fcfbf9; padding: 40px 20px; color: #2e2d2c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eae6e1; border-radius: 8px;"">
            <div style=""text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eae6e1; padding-bottom: 20px;"">
                <span style=""font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #8fa27b; font-weight: bold; display: block; margin-bottom: 5px;"">Pago Recibido</span>
                <h1 style=""font-style: italic; font-weight: normal; font-size: 28px; margin: 0; color: #2e2d2c;"">La Botica del Alma</h1>
            </div>
            <p>Hola <strong>{order.CustomerName}</strong>,</p>
            <p>¡Muchas gracias! Confirmamos la acreditación de tu pago por <strong>${order.Total}</strong> para tu orden <strong>#{order.Id.ToString()[..8]}</strong>.</p>
            
            <div style=""background-color: #f2f5f1; border: 1.5px solid #8fa27b; border-radius: 6px; padding: 15px; margin: 20px 0; font-size: 14px;"">
                Tu pedido se encuentra ahora en estado <strong>Pagado</strong>. Ya nos encontramos empaquetando tus piezas y nos contactaremos para enviarte el código de seguimiento del envío.
            </div>

            <div style=""text-align: center; margin-top: 30px;"">
                <a href=""https://wa.me/5493492274535"" style=""display: inline-block; background-color: #8fa27b; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 13px;"">
                    Consultar por WhatsApp
                </a>
            </div>
        </div>";

        await SendEmailAsync(order.CustomerEmail, subject, html);
    }

    private async Task SendEmailAsync(string to, string subject, string htmlContent)
    {
        try
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

            var payload = new
            {
                from = _fromEmail,
                to = new[] { to },
                subject = subject,
                html = htmlContent
            };

            var json = JsonSerializer.Serialize(payload);
            using var content = new StringContent(json, Encoding.UTF8, "application/json");

            var res = await client.PostAsync("https://api.resend.com/emails", content);
            if (!res.IsSuccessStatusCode)
            {
                var err = await res.Content.ReadAsStringAsync();
                Console.WriteLine($"Error al enviar email via Resend API: {res.StatusCode} - {err}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Excepción al enviar email con Resend: {ex.Message}");
        }
    }
}
