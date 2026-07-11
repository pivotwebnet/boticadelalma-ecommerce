using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BoticaDelAlma.API.Models;

public class Product
{
    [Key, MaxLength(50)]
    public string Id { get; set; } = string.Empty;

    // Código de producto de la planilla de stock de la dueña (SKU interno).
    // Es lo que usa el importador de Excel para saber si crea o actualiza.
    [MaxLength(50)]
    public string? Code { get; set; }

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

    // ── Datos internos de la planilla de stock (no se muestran en la tienda pública) ──
    [MaxLength(200)]
    public string? Provider { get; set; }

    [MaxLength(100)]
    public string? ProductType { get; set; }

    [MaxLength(100)]
    public string? Stone { get; set; }

    public decimal? CostPrice { get; set; }

    public int? MinStock { get; set; }

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
