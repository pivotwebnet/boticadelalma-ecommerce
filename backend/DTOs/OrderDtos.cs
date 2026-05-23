using System.ComponentModel.DataAnnotations;

namespace BoticaDelAlma.API.DTOs;

public record CreateOrderDto(
    [Required] string CustomerName,
    [Required, EmailAddress] string CustomerEmail,
    string? CustomerPhone,
    string? Address,
    string? City,
    string? Notes,
    [Required, MinLength(1)] List<CreateOrderItemDto> Items
);

public record CreateOrderItemDto(
    [Required] string ProductId,
    [Required] string ProductName,
    int PricePaid,
    [Range(1, 100)] int Quantity
);

public record UpdateOrderStatusDto(
    [Required] string Status
);

public record OrderResponseDto(
    Guid Id,
    string Status,
    int Total,
    string CustomerName,
    string CustomerEmail,
    string? CustomerPhone,
    string? Address,
    string? City,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<OrderItemResponseDto> Items
);

public record OrderItemResponseDto(
    Guid Id,
    string ProductId,
    string ProductName,
    int PricePaid,
    int Quantity
);

public record CreateCommentDto(
    [Required] string ProductId,
    [Required] Guid OrderId,
    [Required, MaxLength(200)] string Author,
    [Required, MaxLength(300)] string Text,
    [Range(1, 5)] int Rating
);

public record CommentResponseDto(
    Guid Id,
    string ProductId,
    Guid OrderId,
    string Author,
    string Text,
    int Rating,
    DateTime CreatedAt
);
