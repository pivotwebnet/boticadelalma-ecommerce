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
    int Stock,
    DateTime CreatedAt,
    DateTime UpdatedAt
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
    bool? IsNew,
    bool? IsActive,
    int? Stock
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
