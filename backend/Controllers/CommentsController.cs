using BoticaDelAlma.API.Attributes;
using BoticaDelAlma.API.Data;
using BoticaDelAlma.API.DTOs;
using BoticaDelAlma.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController(BoticaDbContext db) : ControllerBase
{
    [HttpGet]
    [RequireAdminKey]
    public async Task<IActionResult> GetAll()
    {
        var comments = await db.Comments
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentResponseDto(
                c.Id, c.ProductId, c.OrderId,
                c.Author, c.Text, c.Rating, c.CreatedAt))
            .ToListAsync();
        return Ok(comments);
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProduct(string productId)
    {
        var comments = await db.Comments
            .Where(c => c.ProductId == productId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentResponseDto(
                c.Id, c.ProductId, c.OrderId,
                c.Author, c.Text, c.Rating, c.CreatedAt))
            .ToListAsync();

        return Ok(comments);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCommentDto dto)
    {
        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == dto.OrderId);

        if (order is null)
            return BadRequest("La orden no existe.");

        // No se puede reseñar una orden cancelada.
        if (order.Status == "cancelled")
            return BadRequest("No se puede reseñar una orden cancelada.");

        // El producto debe pertenecer realmente a esa orden.
        if (!order.Items.Any(i => i.ProductId == dto.ProductId))
            return BadRequest("Este producto no pertenece a la orden indicada.");

        var alreadyCommented = await db.Comments
            .AnyAsync(c => c.OrderId == dto.OrderId && c.ProductId == dto.ProductId);

        if (alreadyCommented)
            return Conflict("Ya existe un comentario para este producto en esta orden.");

        var comment = new Comment
        {
            ProductId = dto.ProductId,
            OrderId = dto.OrderId,
            // El autor se toma del cliente real de la orden (anti-suplantación).
            Author = order.CustomerName,
            Text = dto.Text,
            Rating = dto.Rating
        };

        db.Comments.Add(comment);
        await db.SaveChangesAsync();

        await UpdateProductStatsAsync(dto.ProductId);

        return CreatedAtAction(null, new CommentResponseDto(
            comment.Id, comment.ProductId, comment.OrderId,
            comment.Author, comment.Text, comment.Rating, comment.CreatedAt));
    }

    [HttpDelete("{id:guid}")]
    [RequireAdminKey]
    public async Task<IActionResult> Delete(Guid id)
    {
        var comment = await db.Comments.FindAsync(id);
        if (comment is null) return NotFound();
        var productId = comment.ProductId;
        db.Comments.Remove(comment);
        await db.SaveChangesAsync();
        await UpdateProductStatsAsync(productId);
        return NoContent();
    }

    private async Task UpdateProductStatsAsync(string productId)
    {
        var product = await db.Products.FindAsync(productId);
        if (product is null) return;
        var ratings = await db.Comments
            .Where(c => c.ProductId == productId)
            .Select(c => c.Rating)
            .ToListAsync();
        product.Reviews = ratings.Count;
        product.Rating = ratings.Count > 0
            ? Math.Round((decimal)ratings.Average(), 1)
            : 0;
        product.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }
}
