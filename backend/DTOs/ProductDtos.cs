using System.ComponentModel.DataAnnotations;

namespace BoticaDelAlma.API.DTOs;

public record ProductResponseDto(
    string Id,
    string Name,
    string CategoryId,
    string? CategoryName,
    int Price,
    int? OriginalPrice,
    string Tone,
    string Label,
    string[] Tags,
    bool IsNew,
    bool IsActive,
    decimal Rating,
    int Reviews,
    string? ImageUrl,
    string[] Images,
    int Stock,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string? Code,
    string? Provider,
    string? ProductType,
    string? Stone,
    decimal? CostPrice,
    int? MinStock
);

// Una fila de la planilla de stock de la dueña (Google Sheets exportado a Excel/CSV).
public record ImportProductRowDto(
    [Required] string Code,
    [Required] string Name,
    [Required] string CategoryName,
    string? Provider,
    string? ProductType,
    string? Stone,
    int Stock,
    int Price,
    decimal? CostPrice,
    int? MinStock
);

public record ImportResultDto(
    int Created,
    int Updated,
    int CategoriesCreated,
    string[] Errors
);

public record CreateProductDto(
    [Required] string Id,
    [Required] string Name,
    [Required] string CategoryId,
    int Price,
    int? OriginalPrice,
    string? Tone,
    string? Label,
    string[]? Tags,
    bool IsNew,
    string? ImageUrl,
    string[]? Images,
    int Stock
);

public record UpdateProductDto(
    string? Name,
    string? CategoryId,
    int? Price,
    int? OriginalPrice,
    string? Tone,
    string? Label,
    string[]? Tags,
    string? ImageUrl,
    string[]? Images,
    bool? IsNew,
    bool? IsActive,
    int? Stock
);

// Ajuste masivo de precios: aplica un % de descuento o aumento a un conjunto
// de productos elegido por la dueña (uno, una categoría, una intención, o todos).
public record BulkPriceDto(
    [Required] string[] ProductIds,
    [Range(1, 1000)] int Percent,
    [Required] string Mode   // "discount" | "increase"
);

public record CategoryResponseDto(
    string Id,
    string Name,
    string Icon,
    bool IsActive,
    int SortOrder,
    int ProductCount
);

public record CreateCategoryDto(
    [Required] string Id,
    [Required] string Name,
    string? Icon,
    int SortOrder
);

public record UpdateCategoryDto(
    string? Name,
    string? Icon,
    bool? IsActive,
    int? SortOrder
);
