using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BoticaDelAlma.API.Models;

public class Product
{
    [Key, MaxLength(50)]
    public string Id { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string CategoryId { get; set; } = string.Empty;

    [ForeignKey(nameof(CategoryId))]
    public Category? Category { get; set; }

    public int Price { get; set; }
    public int? OriginalPrice { get; set; }

    [MaxLength(30)]
    public string Tone { get; set; } = "sage";

    [MaxLength(200)]
    public string Label { get; set; } = string.Empty;

    public string Tags { get; set; } = "[]"; // JSON array stored as string

    public bool IsNew { get; set; }
    public bool IsActive { get; set; } = true;

    // Stock disponible. Joyería artesanal: muchas piezas son limitadas/únicas.
    public int Stock { get; set; } = 10;

    public decimal Rating { get; set; }
    public int Reviews { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    // Galería de fotos (JSON array de URLs). La web muestra EXACTAMENTE estas,
    // sin slots vacíos: si hay 2 cargadas, se ven 2. Máximo 6. La primera es la portada.
    public string Images { get; set; } = "[]";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
