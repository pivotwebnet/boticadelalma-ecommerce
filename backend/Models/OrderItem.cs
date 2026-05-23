using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BoticaDelAlma.API.Models;

public class OrderItem
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid OrderId { get; set; }

    [ForeignKey(nameof(OrderId))]
    public Order Order { get; set; } = null!;

    [Required, MaxLength(200)]
    public string ProductId { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string ProductName { get; set; } = string.Empty;

    public int PricePaid { get; set; }

    public int Quantity { get; set; }
}
