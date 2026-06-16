using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BoticaDelAlma.API.Attributes;

/// <summary>
/// Exige el header X-Admin-Key con el valor de configuración "AdminApiKey"
/// para endpoints administrativos (crear/editar/eliminar, ver órdenes, etc.).
///
/// El frontend Next.js adjunta este header en server-side desde lib/api.ts.
/// Si "AdminApiKey" no está configurada, el filtro NO exige nada (modo
/// desarrollo). En producción DEBE configurarse para proteger la API.
/// </summary>
public sealed class RequireAdminKeyAttribute : ActionFilterAttribute
{
    public const string HeaderName = "X-Admin-Key";

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var config = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var expected = config["AdminApiKey"];

        if (!string.IsNullOrEmpty(expected))
        {
            var provided = context.HttpContext.Request.Headers[HeaderName].ToString();
            if (!CryptographicEquals(provided, expected))
            {
                context.Result = new UnauthorizedObjectResult(new { error = "No autorizado." });
                return;
            }
        }

        base.OnActionExecuting(context);
    }

    // Comparación en tiempo constante para no filtrar la clave por timing.
    private static bool CryptographicEquals(string a, string b)
    {
        if (a.Length != b.Length) return false;
        var diff = 0;
        for (var i = 0; i < a.Length; i++) diff |= a[i] ^ b[i];
        return diff == 0;
    }
}
