using BoticaDelAlma.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Data;

public static class DbSeeder
{
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
                new Product { Id="a01", Name="Anillo Plata 925 Minimalista",     CategoryId="anillos",    Price=19500,            Tone="stone",  Label="anillo · plata",           Tags="[\"plata\",\"amor\",\"comunicación\"]",                       IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="a02", Name="Anillo Acero Quirúrgico Liso",     CategoryId="anillos",    Price=9800,             Tone="cream",  Label="anillo · acero",           Tags="[\"acero quirúrgico\",\"concreción\"]",                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="a03", Name="Anillo Alpaca Luna",               CategoryId="anillos",    Price=6500,             Tone="rose",   Label="anillo · alpaca",          Tags="[\"alpaca\",\"amor\",\"intuición\"]",                          CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80" },
                // ── Collares ─────────────────────────────────────────────────────────────────
                new Product { Id="c01", Name="Collar Plata 925 Celestial",       CategoryId="collares",   Price=24900,            Tone="stone",  Label="collar · plata",           Tags="[\"plata\",\"amor\",\"comunicación\"]",                       IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c02", Name="Collar Acero Dorado Cadena Fina",  CategoryId="collares",   Price=13500,            Tone="ember",  Label="collar · acero dorado",    Tags="[\"acero dorado\",\"prosperidad\"]",                           CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c03", Name="Collar Acero Blanco Minimalista",  CategoryId="collares",   Price=11900,            Tone="cream",  Label="collar · acero blanco",    Tags="[\"acero blanco\",\"calma\"]",                                 CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c04", Name="Collar Cuarzo Rosa Escallas",      CategoryId="collares",   Price=16900,            Tone="rose",   Label="collar · piedras",         Tags="[\"piedras\",\"escallas\",\"amor\",\"sanación\"]",              CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c05", Name="Collar Hilos Con Dije",            CategoryId="collares",   Price=8900,             Tone="sage",   Label="collar · hilos",           Tags="[\"hilos\",\"protección\",\"amor\"]",                          CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="c06", Name="Collar Alpaca Artesanal",          CategoryId="collares",   Price=7500,             Tone="moss",   Label="collar · alpaca",          Tags="[\"alpaca\",\"crecimiento personal\"]",                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80" },
                // ── Dijes ────────────────────────────────────────────────────────────────────
                new Product { Id="d01", Name="Dije Plata 925 Ojo Celeste",       CategoryId="dijes",      Price=14500,            Tone="indigo", Label="dije · plata",             Tags="[\"plata\",\"protección\",\"escudos\"]",                      IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="d02", Name="Dije Acero Quirúrgico Ángel",      CategoryId="dijes",      Price=7800,             Tone="stone",  Label="dije · acero",             Tags="[\"acero quirúrgico\",\"protección\"]",                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="d03", Name="Dije Alpaca Luna Creciente",       CategoryId="dijes",      Price=5900,             Tone="rose",   Label="dije · alpaca",            Tags="[\"alpaca\",\"amor\",\"intuición\"]",                          CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80" },
                // ── Pulseras ─────────────────────────────────────────────────────────────────
                new Product { Id="pu01",Name="Pulsera Plata 925 Eslabones",      CategoryId="pulseras",   Price=21500,            Tone="stone",  Label="pulsera · plata",          Tags="[\"plata\",\"amor\"]",                                       IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pu02",Name="Pulsera Acero Dorado Delicada",    CategoryId="pulseras",   Price=11500,            Tone="ember",  Label="pulsera · acero dorado",   Tags="[\"acero dorado\",\"prosperidad\",\"abundancia\"]",             CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pu03",Name="Pulsera Gamuza Con Turquesa",      CategoryId="pulseras",   Price=9200,             Tone="clay",   Label="pulsera · gamuza",         Tags="[\"gamuza\",\"calma\",\"protección\"]",                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pu04",Name="Pulsera Piedras Roladas Cuarzo",   CategoryId="pulseras",   Price=14900,            Tone="cream",  Label="pulsera · piedras",        Tags="[\"piedras\",\"roladas\",\"sanación\",\"calma\"]",              CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80" },
                // ── Aros ─────────────────────────────────────────────────────────────────────
                new Product { Id="ar01",Name="Aros Argolla Plata 925",           CategoryId="aros",       Price=17500,            Tone="stone",  Label="aros · plata",             Tags="[\"plata\",\"comunicación\",\"amor\"]",                       IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="ar02",Name="Aros Acero Quirúrgico Mini Aro",   CategoryId="aros",       Price=9500,             Tone="cream",  Label="aros · acero",             Tags="[\"acero quirúrgico\",\"amor\"]",                              CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="ar03",Name="Aros Alpaca Boho Tejidos",         CategoryId="aros",       Price=6800,             Tone="moss",   Label="aros · alpaca",            Tags="[\"alpaca\",\"crecimiento personal\"]",                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" },
                // ── Tobilleras ───────────────────────────────────────────────────────────────
                new Product { Id="to01",Name="Tobillera Acero Dorado Fina",      CategoryId="tobilleras", Price=10900,            Tone="ember",  Label="tobillera · acero dorado", Tags="[\"acero dorado\",\"prosperidad\"]",                           CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="to02",Name="Tobillera Hilos Artesanal",        CategoryId="tobilleras", Price=7500,             Tone="sage",   Label="tobillera · hilos",        Tags="[\"hilos\",\"amor\"]",                                         CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="to03",Name="Tobillera Piedras Escallas",       CategoryId="tobilleras", Price=12900,            Tone="rose",   Label="tobillera · piedras",      Tags="[\"piedras\",\"escallas\",\"sanación\",\"amor\"]",              IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80" },
                // ── Piedras Naturales ────────────────────────────────────────────────────────
                new Product { Id="pi01",Name="Amatista En Bruto Pequeña",        CategoryId="piedras",    Price=5500,             Tone="indigo", Label="piedra · en bruto",        Tags="[\"sanación\",\"calma\",\"intuición\"]",                        CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pi02",Name="Amatista En Bruto Grande",         CategoryId="piedras",    Price=18900,            Tone="indigo", Label="piedra · en bruto",        Tags="[\"sanación\",\"intuición\",\"crecimiento personal\"]",         IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pi03",Name="Cuarzo Rosa Rolado Mediano",       CategoryId="piedras",    Price=6900,             Tone="rose",   Label="piedra · rolada",          Tags="[\"amor\",\"calma\",\"sanación\"]",                             CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pi04",Name="Obsidiana Negra Rolada",           CategoryId="piedras",    Price=7800,             Tone="stone",  Label="piedra · rolada",          Tags="[\"protección\",\"escudos\",\"concreción\"]",                   CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="pi05",Name="Citrino Natural Especial",         CategoryId="piedras",    Price=24500, OriginalPrice=29000, Tone="ember",Label="piedra · especial",Tags="[\"abundancia\",\"prosperidad\"]",                              CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1614362984535-6490656a8412?auto=format&fit=crop&w=800&q=80" },
                // ── Complementos ─────────────────────────────────────────────────────────────
                new Product { Id="co01",Name="Péndulo De Cuarzo Con Tablero",    CategoryId="complementos",Price=18500,           Tone="cream",  Label="péndulo · cuarzo",         Tags="[\"sanación\",\"comunicación\",\"intuición\"]",                 CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="co02",Name="Oráculo Del Alma — 44 Cartas",     CategoryId="complementos",Price=22900,           Tone="indigo", Label="oráculo · 44 cartas",      Tags="[\"intuición\",\"comunicación\"]",                             IsNew=true, CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1635332043388-5a4af42795bd?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="co03",Name="Botella Energética Con Amatista",  CategoryId="complementos",Price=15900,           Tone="indigo", Label="botella · amatista",       Tags="[\"sanación\",\"abundancia\"]",                                 CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="co04",Name="Figura Buda Jade Pequeña",         CategoryId="complementos",Price=12500,           Tone="sage",   Label="figura · jade",            Tags="[\"calma\",\"prosperidad\"]",                                  CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80" },
                new Product { Id="co05",Name="Amuleto Ojo Protector",            CategoryId="complementos",Price=9800,            Tone="ember",  Label="amuleto",                  Tags="[\"protección\",\"escudos\"]",                                  CreatedAt=now, UpdatedAt=now, ImageUrl="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80" }
            );
            await db.SaveChangesAsync();
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
}
