using System.ComponentModel.DataAnnotations;

namespace BoticaDelAlma.API.Models;

public class Category
{
    [Key, MaxLength(100)]
    public string Id { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Icon { get; set; } = "leaf";

    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
