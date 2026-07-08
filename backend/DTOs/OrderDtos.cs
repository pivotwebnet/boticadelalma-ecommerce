using System.ComponentModel.DataAnnotations;

namespace BoticaDelAlma.API.DTOs;

public record CreateOrderDto(
    [Required] string CustomerName,
    [Required, EmailAddress] string CustomerEmail,
    string? CustomerPhone,
    string? Address,
    string? City,
    string? Notes,
    [Required, MinLength(1)] List<CreateOrderItemDto> Items,
    // Opcional: solo lo usa el panel para cargar ventas manuales ya cobradas.
    string? Status = null
);

public record CreateOrderItemDto(
    [Required] string ProductId,
    // ProductName y PricePaid los IGNORA el backend: se toman del producto real
    // en la base de datos para evitar manipulación de precios desde el cliente.
    string? ProductName,
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
    List<OrderItemResponseDto> Items,
    string? InitPoint = null
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
