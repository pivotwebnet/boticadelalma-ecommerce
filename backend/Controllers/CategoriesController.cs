using BoticaDelAlma.API.Data;
using BoticaDelAlma.API.DTOs;
using BoticaDelAlma.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(BoticaDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
    {
        var q = db.Categories.AsQueryable();
        if (!includeInactive) q = q.Where(c => c.IsActive);

        var cats = await q.OrderBy(c => c.SortOrder).ToListAsync();

        var counts = await db.Products
            .Where(p => p.IsActive)
            .GroupBy(p => p.CategoryId)
            .Select(g => new { CategoryId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.CategoryId, x => x.Count);

        return Ok(cats.Select(c => new CategoryResponseDto(
            c.Id, c.Name, c.Icon, c.IsActive, c.SortOrder,
            counts.GetValueOrDefault(c.Id, 0))));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        if (await db.Categories.AnyAsync(c => c.Id == dto.Id))
            return Conflict($"Ya existe una categoría con ID '{dto.Id}'.");

        var cat = new Category
        {
            Id        = dto.Id,
            Name      = dto.Name,
            Icon      = dto.Icon ?? "leaf",
            SortOrder = dto.SortOrder
        };
        db.Categories.Add(cat);
        await db.SaveChangesAsync();
        return CreatedAtAction(null, new CategoryResponseDto(
            cat.Id, cat.Name, cat.Icon, cat.IsActive, cat.SortOrder, 0));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateCategoryDto dto)
    {
        var cat = await db.Categories.FindAsync(id);
        if (cat is null) return NotFound();

        if (dto.Name      is not null) cat.Name      = dto.Name;
        if (dto.Icon      is not null) cat.Icon      = dto.Icon;
        if (dto.IsActive.HasValue)     cat.IsActive   = dto.IsActive.Value;
        if (dto.SortOrder.HasValue)    cat.SortOrder  = dto.SortOrder.Value;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var cat = await db.Categories.FindAsync(id);
        if (cat is null) return NotFound();

        if (await db.Products.AnyAsync(p => p.CategoryId == id))
            return BadRequest("No se puede eliminar una categoría que tiene productos.");

        db.Categories.Remove(cat);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
