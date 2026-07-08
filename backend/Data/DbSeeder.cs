using BoticaDelAlma.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Data;

public static class DbSeeder
{
    // Image URL constants — match src/lib/data.ts
    private const string RING_SILVER    = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80";
    private const string RING_STEEL     = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80";
    private const string RING_ALPACA    = "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=800&q=80";
    private const string COLLAR_SILVER  = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80";
    private const string COLLAR_GOLD    = "https://images.unsplash.com/photo-1573408301185-9519f94816b8?auto=format&fit=crop&w=800&q=80";
    private const string COLLAR_WHITE   = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80";
    private const string COLLAR_STONES  = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80";
    private const string COLLAR_THREAD  = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80";
    private const string DIJE_SILVER    = "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80";
    private const string DIJE_STEEL     = "https://images.unsplash.com/photo-1613139944551-2cd5db5a0e7e?auto=format&fit=crop&w=800&q=80";
    private const string PULSERA_SILVER = "https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80";
    private const string PULSERA_GAMUZA = "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80";
    private const string AMATISTA       = "https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80";
    private const string CUARZO_ROSA    = "https://images.unsplash.com/photo-1614362984535-6490656a8412?auto=format&fit=crop&w=800&q=80";
    private const string OBSIDIANA      = "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80";
    private const string CITRINO        = "https://images.unsplash.com/photo-1609151376730-f246f5734c3b?auto=format&fit=crop&w=800&q=80";
    private const string PENDULO        = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80";
    private const string ORACULO        = "https://images.unsplash.com/photo-1635332043388-5a4af42795bd?auto=format&fit=crop&w=800&q=80";
    private const string BUDA           = "https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=800&q=80";

    public static async Task SeedAsync(BoticaDbContext db)
    {
        // Como pediste empezar totalmente de cero, este código ahora 
        // borra cualquier categoría o producto que haya quedado en la base de datos,
        // y ya no inserta datos de prueba automáticamente.
        if (await db.Products.AnyAsync() || await db.Categories.AnyAsync())
        {
            db.Products.RemoveRange(db.Products);
            db.Categories.RemoveRange(db.Categories);
            await db.SaveChangesAsync();
            Console.WriteLine("BASE DE DATOS VACIADA. Lista para cargar productos manuales.");
        }
    }
}
