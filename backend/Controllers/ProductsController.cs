using System.Text.Json;
using System.Text.RegularExpressions;
using BoticaDelAlma.API.Attributes;
using BoticaDelAlma.API.Data;
using BoticaDelAlma.API.DTOs;
using BoticaDelAlma.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public partial class ProductsController(BoticaDbContext db) : ControllerBase
{
    // slug: minúsculas, números y guiones (sin espacios ni acentos).
    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    private static partial Regex SlugRegex();

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? categoryId,
        [FromQuery] string? search,
        [FromQuery] string? material,
        [FromQuery] string? intention,
        [FromQuery] bool?   isNew,
        [FromQuery] int?    minPrice,
        [FromQuery] int?    maxPrice,
        [FromQuery] string? sortBy,
        [FromQuery] bool    includeInactive = false)
    {
        var q = db.Products
            .Include(p => p.Category)
            .AsQueryable();

        // El catálogo público solo muestra activos; el panel admin pide includeInactive=true.
        if (!includeInactive)
            q = q.Where(p => p.IsActive);

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
        return Ok(products.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, [FromQuery] bool includeInactive = false)
    {
        var p = await db.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && (includeInactive || p.IsActive));

        if (p is null) return NotFound();
        return Ok(MapToDto(p));
    }

    [HttpPost]
    [RequireAdminKey]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!SlugRegex().IsMatch(dto.Id))
            return BadRequest("El ID debe ser un slug: solo minúsculas, números y guiones (ej: 'anillo-luna').");

        if (!await db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            return BadRequest($"La categoría '{dto.CategoryId}' no existe.");

        if (await db.Products.AnyAsync(p => p.Id == dto.Id))
            return Conflict($"Ya existe un producto con ID '{dto.Id}'.");

        var priceError = ValidatePricing(dto.Price, dto.OriginalPrice, dto.Stock);
        if (priceError is not null) return BadRequest(priceError);

        var product = new Product
        {
            Id            = dto.Id,
            Name          = dto.Name,
            CategoryId    = dto.CategoryId,
            Price         = dto.Price,
            OriginalPrice = dto.OriginalPrice,
            Tone          = dto.Tone ?? "sage",
            Label         = dto.Label ?? string.Empty,
            Tags          = JsonSerializer.Serialize(dto.Tags ?? []),
            IsNew         = dto.IsNew,
            ImageUrl      = dto.ImageUrl,
            Stock         = dto.Stock,
        };

        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, MapToDto(product));
    }

    [HttpPut("{id}")]
    [RequireAdminKey]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateProductDto dto)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();

        if (dto.CategoryId is not null && !await db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            return BadRequest($"La categoría '{dto.CategoryId}' no existe.");

        // Valida la combinación final de precio/original/stock.
        var finalPrice    = dto.Price ?? product.Price;
        var finalOriginal = dto.OriginalPrice;
        var finalStock    = dto.Stock ?? product.Stock;
        var priceError    = ValidatePricing(finalPrice, finalOriginal, finalStock);
        if (priceError is not null) return BadRequest(priceError);

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
        if (dto.Stock.HasValue)          product.Stock       = dto.Stock.Value;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [RequireAdminKey]
    public async Task<IActionResult> Delete(string id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();

        // Si el producto tiene historial de ventas, NO se borra (rompería las órdenes):
        // se desactiva (soft-delete) para conservar el historial.
        var hasOrderHistory = await db.OrderItems.AnyAsync(oi => oi.ProductId == id);
        if (hasOrderHistory)
        {
            product.IsActive = false;
            product.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Ok(new { softDeleted = true, message = "El producto tiene ventas registradas, se desactivó en lugar de eliminarse." });
        }

        // Sin historial: borrado real, limpiando sus reseñas huérfanas.
        var comments = db.Comments.Where(c => c.ProductId == id);
        db.Comments.RemoveRange(comments);
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return Ok(new { softDeleted = false });
    }

    // Devuelve un mensaje de error o null si la combinación es válida.
    private static string? ValidatePricing(int price, int? originalPrice, int stock)
    {
        if (price < 0) return "El precio no puede ser negativo.";
        if (stock < 0) return "El stock no puede ser negativo.";
        if (originalPrice.HasValue && originalPrice.Value <= price)
            return "El precio original (tachado) debe ser mayor que el precio actual.";
        return null;
    }

    private static ProductResponseDto MapToDto(Product p)
    {
        string[] tags;
        try   { tags = JsonSerializer.Deserialize<string[]>(p.Tags) ?? []; }
        catch { tags = []; }
        return new ProductResponseDto(
            p.Id, p.Name, p.CategoryId, p.Category?.Name,
            p.Price, p.OriginalPrice, p.Tone, p.Label, tags,
            p.IsNew, p.IsActive, p.Rating, p.Reviews,
            p.ImageUrl, p.Stock, p.CreatedAt, p.UpdatedAt);
    }
}
