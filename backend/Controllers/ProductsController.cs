using System.Text.Json;
using BoticaDelAlma.API.Data;
using BoticaDelAlma.API.DTOs;
using BoticaDelAlma.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(BoticaDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? categoryId, [FromQuery] string? search)
    {
        var q = db.Products.Include(p => p.Category).AsQueryable();
        if (!string.IsNullOrEmpty(categoryId)) q = q.Where(p => p.CategoryId == categoryId);
        if (!string.IsNullOrEmpty(search)) q = q.Where(p => p.Name.ToLower().Contains(search.ToLower()));
        var list = await q.OrderBy(p => p.CategoryId).ThenBy(p => p.Name).ToListAsync();
        return Ok(list.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var p = await db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (p is null) return NotFound();
        return Ok(MapToDto(p));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (await db.Products.AnyAsync(p => p.Id == dto.Id))
            return Conflict($"Ya existe un producto con ID '{dto.Id}'.");

        var product = new Product
        {
            Id = dto.Id,
            Name = dto.Name,
            CategoryId = dto.CategoryId,
            Price = dto.Price,
            OriginalPrice = dto.OriginalPrice,
            Tone = dto.Tone ?? "sage",
            Label = dto.Label ?? string.Empty,
            Tags = JsonSerializer.Serialize(dto.Tags ?? []),
            IsNew = dto.IsNew,
        };

        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, MapToDto(product));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateProductDto dto)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();

        if (dto.Name is not null) product.Name = dto.Name;
        if (dto.CategoryId is not null) product.CategoryId = dto.CategoryId;
        if (dto.Price.HasValue) product.Price = dto.Price.Value;
        product.OriginalPrice = dto.OriginalPrice;
        if (dto.Tone is not null) product.Tone = dto.Tone;
        if (dto.Label is not null) product.Label = dto.Label;
        if (dto.Tags is not null) product.Tags = JsonSerializer.Serialize(dto.Tags);
        if (dto.IsNew.HasValue) product.IsNew = dto.IsNew.Value;
        if (dto.IsActive.HasValue) product.IsActive = dto.IsActive.Value;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static ProductResponseDto MapToDto(Product p)
    {
        string[] tags;
        try { tags = JsonSerializer.Deserialize<string[]>(p.Tags) ?? []; }
        catch { tags = []; }
        return new ProductResponseDto(
            p.Id, p.Name, p.CategoryId, p.Category?.Name,
            p.Price, p.OriginalPrice, p.Tone, p.Label, tags,
            p.IsNew, p.IsActive, p.Rating, p.Reviews,
            p.CreatedAt, p.UpdatedAt);
    }
}
