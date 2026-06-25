using BoticaDelAlma.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<BoticaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Orígenes permitidos para CORS, configurables por "AllowedOrigins" (coma-separado);
// por defecto el front local. OJO: CORS lo aplica el navegador, NO protege contra
// ataques directos al backend; en producción el backend debe estar en red interna
// (ver CONTEXTO.md → Seguridad / Despliegue).
var allowedOrigins = builder.Configuration["AllowedOrigins"]
        ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? ["http://localhost:3000"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Aplica las migraciones pendientes SIEMPRE al arrancar (dev y prod). Si no, en
// producción la base quedaría sin las columnas nuevas y la app fallaría. El seed
// de catálogo inicial corre solo en desarrollo.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BoticaDbContext>();
    db.Database.Migrate();
    if (app.Environment.IsDevelopment() || !db.Categories.Any())
        await DbSeeder.SeedAsync(db);
}

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

// Detrás de Cloudflare/Coolify el TLS termina en el proxy y la app recibe HTTP;
// no se fuerza HttpsRedirection acá para evitar loops de redirección.

app.UseCors("FrontendPolicy");
app.MapControllers();

app.Run();
