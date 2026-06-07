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
    public async Task<IActionResult> GetAll(
        [FromQuery] string? categoryId,
        [FromQuery] string? search,
        [FromQuery] string? material,
        [FromQuery] string? intention,
        [FromQuery] bool?   isNew,
        [FromQuery] int?    minPrice,
        [FromQuery] int?    maxPrice,
        [FromQuery] string? sortBy)
    {
        var q = db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrEmpty(categoryId))
            q = q.Where(p => p.CategoryId == categoryId);

        if (!string.IsNullOrEmpty(search))
            q = q.Where(p => p.Name.ToLower().Contains(search.ToLower()));

        // Tags es un JSON array guardado como string — la búsqueda parcial es suficiente
        // porque el frontend envía los valores exactos del MATERIALS/INTENTIONS array.
        if (!string.IsNullOrEmpty(material))
            q = q.Where(p => p.Tags.ToLower().Contains(material.ToLower()));

        if (!string.IsNullOrEmpty(intention))
            q = q.Where(p => p.Tags.ToLower().Contains(intention.ToLower()));

        if (isNew.HasValue)
            q = q.Where(p => p.IsNew == isNew.Value);

        if (minPrice.HasValue)
            q = q.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            q = q.Where(p => p.Price <= maxPrice.Value);

        q = sortBy switch
        {
            "price-asc"  => q.OrderBy(p => p.Price),
            "price-desc" => q.OrderByDescending(p => p.Price),
            "newest"     => q.OrderByDescending(p => p.CreatedAt),
            "rating"     => q.OrderByDescending(p => p.Rating),
            "name"       => q.OrderBy(p => p.Name),
            _            => q.OrderBy(p => p.CategoryId).ThenBy(p => p.Name),
        };

        var products = await q.ToListAsync();

        var productIds = products.Select(p => p.Id).ToList();
        var stats = await db.Comments
            .Where(c => productIds.Contains(c.ProductId))
            .GroupBy(c => c.ProductId)
            .Select(g => new {
                ProductId = g.Key,
                Count = g.Count(),
                Avg   = g.Average(c => (decimal)c.Rating)
            })
            .ToDictionaryAsync(x => x.ProductId, x => x);

        return Ok(products.Select(p => {
            var s = stats.GetValueOrDefault(p.Id);
            return MapToDto(p, s?.Avg ?? 0, s?.Count ?? 0);
        }));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var p = await db.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

        if (p is null) return NotFound();

        var stats = await db.Comments
            .Where(c => c.ProductId == id)
            .GroupBy(c => c.ProductId)
            .Select(g => new {
                Count = g.Count(),
                Avg   = g.Average(c => (decimal)c.Rating)
            })
            .FirstOrDefaultAsync();

        return Ok(MapToDto(p, stats?.Avg ?? 0, stats?.Count ?? 0));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!await db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            return BadRequest($"La categoría '{dto.CategoryId}' no existe.");

        if (await db.Products.AnyAsync(p => p.Id == dto.Id))
            return Conflict($"Ya existe un producto con ID '{dto.Id}'.");

        var product = new Product
        {
            Id          = dto.Id,
            Name        = dto.Name,
            CategoryId  = dto.CategoryId,
            Price       = dto.Price,
            OriginalPrice = dto.OriginalPrice,
            Tone        = dto.Tone ?? "sage",
            Label       = dto.Label ?? string.Empty,
            Tags        = JsonSerializer.Serialize(dto.Tags ?? []),
            IsNew       = dto.IsNew,
            ImageUrl    = dto.ImageUrl,
        };

        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, MapToDto(product, 0, 0));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateProductDto dto)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();

        if (dto.CategoryId is not null && !await db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            return BadRequest($"La categoría '{dto.CategoryId}' no existe.");

        if (dto.Name        is not null) product.Name        = dto.Name;
        if (dto.CategoryId  is not null) product.CategoryId  = dto.CategoryId;
        if (dto.Price.HasValue)          product.Price        = dto.Price.Value;
        product.OriginalPrice = dto.OriginalPrice;
        if (dto.Tone        is not null) product.Tone        = dto.Tone;
        if (dto.Label       is not null) product.Label       = dto.Label;
        if (dto.Tags        is not null) product.Tags        = JsonSerializer.Serialize(dto.Tags);
        if (dto.ImageUrl    is not null) product.ImageUrl    = dto.ImageUrl == "" ? null : dto.ImageUrl;
        if (dto.IsNew.HasValue)          product.IsNew       = dto.IsNew.Value;
        if (dto.IsActive.HasValue)       product.IsActive    = dto.IsActive.Value;
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

    private static ProductResponseDto MapToDto(Product p, decimal avgRating, int reviewsCount)
    {
        string[] tags;
        try   { tags = JsonSerializer.Deserialize<string[]>(p.Tags) ?? []; }
        catch { tags = []; }
        return new ProductResponseDto(
            p.Id, p.Name, p.CategoryId, p.Category?.Name,
            p.Price, p.OriginalPrice, p.Tone, p.Label, tags,
            p.IsNew, p.IsActive, avgRating, reviewsCount,
            p.ImageUrl, p.CreatedAt, p.UpdatedAt);
    }
}
