using BoticaDelAlma.API.Models;

namespace BoticaDelAlma.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(BoticaDbContext db)
    {
        if (!db.Categories.Any())
        {
            db.Categories.AddRange(
                new Category { Id = "collares",   Name = "Collares",               Icon = "necklace",  SortOrder = 1 },
                new Category { Id = "cristales",  Name = "Cristales & Piedras",    Icon = "crystal",   SortOrder = 2 },
                new Category { Id = "inciensos",  Name = "Inciensos & Sahumerios", Icon = "incense",   SortOrder = 3 },
                new Category { Id = "velas",      Name = "Velas Rituales",         Icon = "candle",    SortOrder = 4 },
                new Category { Id = "tarot",      Name = "Tarot & Oráculos",       Icon = "tarot",     SortOrder = 5 },
                new Category { Id = "accesorios", Name = "Accesorios",             Icon = "accessory", SortOrder = 6 }
            );
            await db.SaveChangesAsync();
        }

        if (!db.Products.Any())
        {
            var now = DateTime.UtcNow;
            db.Products.AddRange(
                // Collares
                new Product { Id="p01", Name="Colgante Luna Creciente",   CategoryId="collares",   Price=18500, OriginalPrice=24000, Tone="stone",  Label="colgante · plata",    Tags="[\"plata 925\",\"hecho a mano\",\"intuición\"]", Rating=4.8m, Reviews=124, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p02", Name="Collar Raíz de Árbol",      CategoryId="collares",   Price=22800,                     Tone="moss",   Label="collar · bronce",     Tags="[\"bronce\",\"cordón\",\"anclaje\"]",            Rating=4.9m, Reviews=87,  IsNew=true, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p03", Name="Gargantilla Cuarzo Rosa",   CategoryId="collares",   Price=14900,                     Tone="rose",   Label="gargantilla",         Tags="[\"cuarzo rosa\",\"amor\"]",                    Rating=4.7m, Reviews=203, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p04", Name="Colgante Ojo Turco",        CategoryId="collares",   Price=9800,                      Tone="indigo", Label="colgante",            Tags="[\"protección\"]",                             Rating=4.6m, Reviews=56,  CreatedAt=now, UpdatedAt=now },
                // Cristales
                new Product { Id="p05", Name="Amatista en Bruto — 250g", CategoryId="cristales",  Price=12500,                     Tone="indigo", Label="cristal · bruto",     Tags="[\"amatista\",\"intuición\"]",                  Rating=4.9m, Reviews=312, IsNew=true, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p06", Name="Cuarzo Blanco Pulido",      CategoryId="cristales",  Price=6400,                      Tone="cream",  Label="cristal · pulido",    Tags="[\"claridad\",\"limpieza\"]",                   Rating=4.8m, Reviews=178, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p07", Name="Set Chakras 7 Piedras",     CategoryId="cristales",  Price=24900, OriginalPrice=29500, Tone="sage",   Label="set · 7 piezas",      Tags="[\"chakras\",\"set\",\"anclaje\"]",              Rating=5.0m, Reviews=91,  CreatedAt=now, UpdatedAt=now },
                new Product { Id="p08", Name="Obsidiana Negra Pulida",    CategoryId="cristales",  Price=7900,                      Tone="stone",  Label="cristal · pulido",    Tags="[\"obsidiana\",\"protección\",\"anclaje\"]",     Rating=4.7m, Reviews=142, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p09", Name="Citrino Natural",           CategoryId="cristales",  Price=8900,                      Tone="ember",  Label="cristal",             Tags="[\"abundancia\"]",                             Rating=4.8m, Reviews=67,  CreatedAt=now, UpdatedAt=now },
                // Inciensos
                new Product { Id="p10", Name="Palo Santo — 5 varas",      CategoryId="inciensos",  Price=4800,                      Tone="clay",   Label="sahumerio",           Tags="[\"palo santo\",\"Perú\",\"limpieza\"]",         Rating=4.9m, Reviews=421, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p11", Name="Salvia Blanca Atado",       CategoryId="inciensos",  Price=6500,                      Tone="sage",   Label="sahumerio",           Tags="[\"salvia\",\"limpieza\",\"protección\"]",       Rating=4.9m, Reviews=356, IsNew=true, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p12", Name="Inciensos Nag Champa x12",  CategoryId="inciensos",  Price=3200,                      Tone="ember",  Label="incienso · caja",     Tags="[\"India\",\"amor\"]",                          Rating=4.7m, Reviews=289, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p13", Name="Resina Mirra 30g",          CategoryId="inciensos",  Price=5400,                      Tone="ember",  Label="resina",              Tags="[\"mirra\",\"meditación\",\"abundancia\"]",      Rating=4.8m, Reviews=74,  CreatedAt=now, UpdatedAt=now },
                // Velas
                new Product { Id="p14", Name="Vela 7 Días — Abundancia", CategoryId="velas",      Price=5200,                      Tone="cream",  Label="vela ritual",         Tags="[\"abundancia\",\"7 días\"]",                   Rating=4.8m, Reviews=198, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p15", Name="Vela Miel & Canela",        CategoryId="velas",      Price=4200,                      Tone="clay",   Label="vela aromática",      Tags="[\"miel\",\"amor\"]",                           Rating=4.9m, Reviews=112, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p16", Name="Vela Salvia — Limpieza",   CategoryId="velas",      Price=4800,                      Tone="sage",   Label="vela ritual",         Tags="[\"limpieza\"]",                               Rating=4.9m, Reviews=267, IsNew=true, CreatedAt=now, UpdatedAt=now },
                // Tarot
                new Product { Id="p17", Name="Tarot Rider-Waite Clásico",CategoryId="tarot",      Price=18900,                     Tone="cream",  Label="baraja · 78 cartas",  Tags="[\"principiantes\",\"intuición\"]",              Rating=4.9m, Reviews=512, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p18", Name="Oráculo de la Luna",        CategoryId="tarot",      Price=22400,                     Tone="indigo", Label="oráculo · 44 cartas", Tags="[\"luna\",\"intuición\"]",                      Rating=4.8m, Reviews=143, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p19", Name="Mantel de Tarot Bordado",   CategoryId="tarot",      Price=9500,                      Tone="moss",   Label="mantel 55x55cm",      Tags="[\"accesorio\",\"amor\"]",                      Rating=4.7m, Reviews=62,  CreatedAt=now, UpdatedAt=now },
                // Accesorios
                new Product { Id="p20", Name="Porta Sahumerios Cerámica", CategoryId="accesorios", Price=6800,                      Tone="clay",   Label="cerámica",            Tags="[\"hecho a mano\",\"anclaje\"]",                Rating=4.8m, Reviews=89,  CreatedAt=now, UpdatedAt=now },
                new Product { Id="p21", Name="Campana Tibetana Mini",     CategoryId="accesorios", Price=14500,                     Tone="ember",  Label="bronce",              Tags="[\"sonido\",\"meditación\",\"anclaje\"]",        Rating=4.9m, Reviews=54,  IsNew=true, CreatedAt=now, UpdatedAt=now },
                new Product { Id="p22", Name="Cuenco de Cuarzo 8\"",      CategoryId="accesorios", Price=32900,                     Tone="cream",  Label="cuenco sonoro",       Tags="[\"sonoterapia\",\"abundancia\"]",               Rating=5.0m, Reviews=38,  CreatedAt=now, UpdatedAt=now },
                new Product { Id="p23", Name="Bolsita Ritual Lino",       CategoryId="accesorios", Price=2900,                      Tone="sage",   Label="accesorio",           Tags="[\"lino natural\",\"protección\"]",              Rating=4.6m, Reviews=127, CreatedAt=now, UpdatedAt=now }
            );
            await db.SaveChangesAsync();
        }
    }
}
