using BoticaDelAlma.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Data;

public static class DbSeeder
{
    // Bump this key when images change in data.ts so the sync runs again.
    private const string IMAGE_VERSION_KEY = "img-v2";

    public static async Task SeedAsync(BoticaDbContext db)
    {
        // Si las categorías del catálogo real no existen aún, limpiamos y resembramos.
        bool needsReseed = !db.Categories.Any(c => c.Id == "anillos");
        if (needsReseed)
        {
            db.Products.RemoveRange(db.Products);
            db.Categories.RemoveRange(db.Categories);
            await db.SaveChangesAsync();

            db.Categories.AddRange(
                // Joyería
                new Category { Id = "anillos",    Name = "Anillos",          Icon = "ring",     SortOrder = 1 },
                new Category { Id = "collares",   Name = "Collares",         Icon = "necklace", SortOrder = 2 },
                new Category { Id = "dijes",      Name = "Dijes",            Icon = "charm",    SortOrder = 3 },
                new Category { Id = "pulseras",   Name = "Pulseras",         Icon = "bracelet", SortOrder = 4 },
                new Category { Id = "aros",       Name = "Aros",             Icon = "earring",  SortOrder = 5 },
                new Category { Id = "tobilleras", Name = "Tobilleras",       Icon = "anklet",   SortOrder = 6 },
                // Piedras y Complementos
                new Category { Id = "piedras",      Name = "Piedras Naturales", Icon = "crystal",  SortOrder = 7 },
                new Category { Id = "complementos", Name = "Complementos",      Icon = "accessory",SortOrder = 8 }
            );
            await db.SaveChangesAsync();
        }

        if (!db.Products.Any())
        {
            var now = DateTime.UtcNow;
            db.Products.AddRange(
                // ── Anillos ──────────────────────────────────────────────────────────────────
                new Product { Id="a01",  CategoryId="anillos",     Name="Anillo Plata 925 Minimalista",     Price=19500,            Tone="stone",  Label="anillo · plata",           Tags="[\"plata\",\"amor\",\"comunicación\"]",                       IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="a02",  CategoryId="anillos",     Name="Anillo Acero Quirúrgico Liso",     Price=9800,             Tone="cream",  Label="anillo · acero",           Tags="[\"acero quirúrgico\",\"concreción\"]",                                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="a03",  CategoryId="anillos",     Name="Anillo Alpaca Luna",               Price=6500,             Tone="rose",   Label="anillo · alpaca",          Tags="[\"alpaca\",\"amor\",\"intuición\"]",                                          CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=800&q=80" },
                // ── Collares ─────────────────────────────────────────────────────────────────
                new Product { Id="c01",  CategoryId="collares",    Name="Collar Plata 925 Celestial",       Price=24900,            Tone="stone",  Label="collar · plata",           Tags="[\"plata\",\"amor\",\"comunicación\"]",                       IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c02",  CategoryId="collares",    Name="Collar Acero Dorado Cadena Fina",  Price=13500,            Tone="ember",  Label="collar · acero dorado",    Tags="[\"acero dorado\",\"prosperidad\"]",                                           CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1573408301185-9519f94816b8?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c03",  CategoryId="collares",    Name="Collar Acero Blanco Minimalista",  Price=11900,            Tone="cream",  Label="collar · acero blanco",    Tags="[\"acero blanco\",\"calma\"]",                                                CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c04",  CategoryId="collares",    Name="Collar Cuarzo Rosa Escallas",      Price=16900,            Tone="rose",   Label="collar · piedras",         Tags="[\"piedras\",\"escallas\",\"amor\",\"sanación\"]",                             CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c05",  CategoryId="collares",    Name="Collar Hilos Con Dije",            Price=8900,             Tone="sage",   Label="collar · hilos",           Tags="[\"hilos\",\"protección\",\"amor\"]",                                          CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c06",  CategoryId="collares",    Name="Collar Alpaca Artesanal",          Price=7500,             Tone="moss",   Label="collar · alpaca",          Tags="[\"alpaca\",\"crecimiento personal\"]",                                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80" },
                // ── Dijes ────────────────────────────────────────────────────────────────────
                new Product { Id="d01",  CategoryId="dijes",       Name="Dije Plata 925 Ojo Celeste",       Price=14500,            Tone="indigo", Label="dije · plata",             Tags="[\"plata\",\"protección\",\"escudos\"]",                      IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="d02",  CategoryId="dijes",       Name="Dije Acero Quirúrgico Ángel",      Price=7800,             Tone="stone",  Label="dije · acero",             Tags="[\"acero quirúrgico\",\"protección\"]",                                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1613139944551-2cd5db5a0e7e?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="d03",  CategoryId="dijes",       Name="Dije Alpaca Luna Creciente",       Price=5900,             Tone="rose",   Label="dije · alpaca",            Tags="[\"alpaca\",\"amor\",\"intuición\"]",                                          CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=800&q=80" },
                // ── Pulseras ─────────────────────────────────────────────────────────────────
                new Product { Id="pu01", CategoryId="pulseras",    Name="Pulsera Plata 925 Eslabones",      Price=21500,            Tone="stone",  Label="pulsera · plata",          Tags="[\"plata\",\"amor\"]",                                       IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pu02", CategoryId="pulseras",    Name="Pulsera Acero Dorado Delicada",    Price=11500,            Tone="ember",  Label="pulsera · acero dorado",   Tags="[\"acero dorado\",\"prosperidad\",\"abundancia\"]",                            CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pu03", CategoryId="pulseras",    Name="Pulsera Gamuza Con Turquesa",      Price=9200,             Tone="clay",   Label="pulsera · gamuza",         Tags="[\"gamuza\",\"calma\",\"protección\"]",                                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pu04", CategoryId="pulseras",    Name="Pulsera Piedras Roladas Cuarzo",   Price=14900,            Tone="cream",  Label="pulsera · piedras",        Tags="[\"piedras\",\"roladas\",\"sanación\",\"calma\"]",                             CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" },
                // ── Aros ─────────────────────────────────────────────────────────────────────
                new Product { Id="ar01", CategoryId="aros",        Name="Aros Argolla Plata 925",           Price=17500,            Tone="stone",  Label="aros · plata",             Tags="[\"plata\",\"comunicación\",\"amor\"]",                       IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="ar02", CategoryId="aros",        Name="Aros Acero Quirúrgico Mini Aro",   Price=9500,             Tone="cream",  Label="aros · acero",             Tags="[\"acero quirúrgico\",\"amor\"]",                                              CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="ar03", CategoryId="aros",        Name="Aros Alpaca Boho Tejidos",         Price=6800,             Tone="moss",   Label="aros · alpaca",            Tags="[\"alpaca\",\"crecimiento personal\"]",                                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80" },
                // ── Tobilleras ───────────────────────────────────────────────────────────────
                new Product { Id="to01", CategoryId="tobilleras",  Name="Tobillera Acero Dorado Fina",      Price=10900,            Tone="ember",  Label="tobillera · acero dorado", Tags="[\"acero dorado\",\"prosperidad\"]",                                           CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="to02", CategoryId="tobilleras",  Name="Tobillera Hilos Artesanal",        Price=7500,             Tone="sage",   Label="tobillera · hilos",        Tags="[\"hilos\",\"amor\"]",                                                         CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="to03", CategoryId="tobilleras",  Name="Tobillera Piedras Escallas",       Price=12900,            Tone="rose",   Label="tobillera · piedras",      Tags="[\"piedras\",\"escallas\",\"sanación\",\"amor\"]",            IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80" },
                // ── Piedras Naturales ────────────────────────────────────────────────────────
                new Product { Id="pi01", CategoryId="piedras",     Name="Amatista En Bruto Pequeña",        Price=5500,             Tone="indigo", Label="piedra · en bruto",        Tags="[\"sanación\",\"calma\",\"intuición\"]",                                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pi02", CategoryId="piedras",     Name="Amatista En Bruto Grande",         Price=18900,            Tone="indigo", Label="piedra · en bruto",        Tags="[\"sanación\",\"intuición\",\"crecimiento personal\"]",       IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pi03", CategoryId="piedras",     Name="Cuarzo Rosa Rolado Mediano",       Price=6900,             Tone="rose",   Label="piedra · rolada",          Tags="[\"amor\",\"calma\",\"sanación\"]",                                             CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1614362984535-6490656a8412?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pi04", CategoryId="piedras",     Name="Obsidiana Negra Rolada",           Price=7800,             Tone="stone",  Label="piedra · rolada",          Tags="[\"protección\",\"escudos\",\"concreción\"]",                                   CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pi05", CategoryId="piedras",     Name="Citrino Natural Especial",         Price=24500, OriginalPrice=29000, Tone="ember", Label="piedra · especial", Tags="[\"abundancia\",\"prosperidad\"]",                                              CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1609151376730-f246f5734c3b?auto=format&fit=crop&w=800&q=80" },
                // ── Complementos ─────────────────────────────────────────────────────────────
                new Product { Id="co01", CategoryId="complementos", Name="Péndulo De Cuarzo Con Tablero",   Price=18500,            Tone="cream",  Label="péndulo · cuarzo",         Tags="[\"sanación\",\"comunicación\",\"intuición\"]",                                 CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="co02", CategoryId="complementos", Name="Oráculo Del Alma — 44 Cartas",    Price=22900,            Tone="indigo", Label="oráculo · 44 cartas",      Tags="[\"intuición\",\"comunicación\"]",                            IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1635332043388-5a4af42795bd?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="co03", CategoryId="complementos", Name="Botella Energética Con Amatista", Price=15900,            Tone="indigo", Label="botella · amatista",       Tags="[\"sanación\",\"abundancia\"]",                                                 CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="co04", CategoryId="complementos", Name="Figura Buda Jade Pequeña",        Price=12500,            Tone="sage",   Label="figura · jade",            Tags="[\"calma\",\"prosperidad\"]",                                                   CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="co05", CategoryId="complementos", Name="Amuleto Ojo Protector",           Price=9800,             Tone="ember",  Label="amuleto",                  Tags="[\"protección\",\"escudos\"]",                                                  CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80" }
            );
            await db.SaveChangesAsync();
        }
        else
        {
            // Products exist — sync their image URLs to match the current catalog (img-v2).
            // Only runs if at least one product has an outdated image.
            await SyncImageUrlsAsync(db);
        }

        // Siempre mantener Rating/Reviews en 0 — se calculan dinámicamente desde Comments.
        var productsToFix = await db.Products.Where(p => p.Rating > 0 || p.Reviews > 0).ToListAsync();
        if (productsToFix.Any())
        {
            foreach (var p in productsToFix) { p.Rating = 0; p.Reviews = 0; }
            await db.SaveChangesAsync();
        }

        if (!db.Orders.Any())
        {
            var orderId = Guid.NewGuid();
            var order = new Order
            {
                Id = orderId,
                CustomerName = "Ana García",
                CustomerEmail = "ana@example.com",
                Status = "paid",
                Total = 45000,
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            };
            db.Orders.Add(order);

            db.Comments.AddRange(
                new Comment { OrderId = orderId, ProductId = "c01", Author = "Ana García",    Rating = 5, Text = "Hermoso collar, la plata es de excelente calidad.",           CreatedAt = DateTime.UtcNow.AddDays(-9) },
                new Comment { OrderId = orderId, ProductId = "pi02", Author = "Ana García",   Rating = 4, Text = "La amatista es preciosa, aunque un poco más pesada de lo que esperaba.", CreatedAt = DateTime.UtcNow.AddDays(-8) }
            );

            var orderId2 = Guid.NewGuid();
            db.Orders.Add(new Order
            {
                Id = orderId2,
                CustomerName = "Carlos Perez",
                CustomerEmail = "carlos@example.com",
                Status = "paid",
                Total = 22000,
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            });
            db.Comments.AddRange(
                new Comment { OrderId = orderId2, ProductId = "a01", Author = "Carlos Perez",  Rating = 5, Text = "Anillo minimalista y muy elegante, lo recomiendo.",           CreatedAt = DateTime.UtcNow.AddDays(-15) },
                new Comment { OrderId = orderId2, ProductId = "pu01", Author = "Carlos Perez", Rating = 4, Text = "Pulsera muy bien trabajada, la plata brilla mucho.",          CreatedAt = DateTime.UtcNow.AddDays(-14) }
            );

            var orderId3 = Guid.NewGuid();
            db.Orders.Add(new Order
            {
                Id = orderId3,
                CustomerName = "Lucía Fernández",
                CustomerEmail = "lucia@example.com",
                Status = "paid",
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            });
            db.Comments.AddRange(
                new Comment { OrderId = orderId3, ProductId = "c04", Author = "Lucía Fernández", Rating = 5, Text = "El collar de escallas de cuarzo rosa es hermoso, se lo regalo a mi mamá.", CreatedAt = DateTime.UtcNow.AddDays(-4) },
                new Comment { OrderId = orderId3, ProductId = "co01", Author = "Lucía Fernández", Rating = 5, Text = "El péndulo llega perfectamente centrado, el tablero es muy completo.", CreatedAt = DateTime.UtcNow.AddDays(-3) }
            );

            await db.SaveChangesAsync();
        }
    }

    // Keeps DB image URLs in sync with the latest catalog version.
    private static async Task SyncImageUrlsAsync(BoticaDbContext db)
    {
        var catalog = new Dictionary<string, string>
        {
            ["a01"]  = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
            ["a02"]  = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
            ["a03"]  = "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=800&q=80",
            ["c01"]  = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
            ["c02"]  = "https://images.unsplash.com/photo-1573408301185-9519f94816b8?auto=format&fit=crop&w=800&q=80",
            ["c03"]  = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
            ["c04"]  = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
            ["c05"]  = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
            ["c06"]  = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
            ["d01"]  = "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
            ["d02"]  = "https://images.unsplash.com/photo-1613139944551-2cd5db5a0e7e?auto=format&fit=crop&w=800&q=80",
            ["d03"]  = "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=800&q=80",
            ["pu01"] = "https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80",
            ["pu02"] = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
            ["pu03"] = "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80",
            ["pu04"] = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
            ["ar01"] = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
            ["ar02"] = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
            ["ar03"] = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
            ["to01"] = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
            ["to02"] = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
            ["to03"] = "https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80",
            ["pi01"] = "https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80",
            ["pi02"] = "https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80",
            ["pi03"] = "https://images.unsplash.com/photo-1614362984535-6490656a8412?auto=format&fit=crop&w=800&q=80",
            ["pi04"] = "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80",
            ["pi05"] = "https://images.unsplash.com/photo-1609151376730-f246f5734c3b?auto=format&fit=crop&w=800&q=80",
            ["co01"] = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80",
            ["co02"] = "https://images.unsplash.com/photo-1635332043388-5a4af42795bd?auto=format&fit=crop&w=800&q=80",
            ["co03"] = "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80",
            ["co04"] = "https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=800&q=80",
            ["co05"] = "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
        };

        var ids = catalog.Keys.ToList();
        var products = await db.Products.Where(p => ids.Contains(p.Id)).ToListAsync();
        bool changed = false;
        foreach (var p in products)
        {
            if (catalog.TryGetValue(p.Id, out var url) && p.ImageUrl != url)
            {
                p.ImageUrl = url;
                changed = true;
            }
        }
        if (changed) await db.SaveChangesAsync();
    }
}
