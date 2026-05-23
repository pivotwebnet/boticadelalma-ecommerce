using BoticaDelAlma.API.Data;
using BoticaDelAlma.API.DTOs;
using BoticaDelAlma.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoticaDelAlma.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(BoticaDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await db.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => MapToResponse(o))
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null) return NotFound();
        return Ok(MapToResponse(order));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var order = new Order
        {
            CustomerName = dto.CustomerName,
            CustomerEmail = dto.CustomerEmail,
            CustomerPhone = dto.CustomerPhone,
            Address = dto.Address,
            City = dto.City,
            Notes = dto.Notes,
            Items = dto.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                PricePaid = i.PricePaid,
                Quantity = i.Quantity
            }).ToList()
        };

        order.Total = order.Items.Sum(i => i.PricePaid * i.Quantity);

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, MapToResponse(order));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
    {
        var validStatuses = new[] { "pending", "paid", "shipped", "cancelled" };
        if (!validStatuses.Contains(dto.Status))
            return BadRequest($"Estado inválido. Válidos: {string.Join(", ", validStatuses)}");

        var order = await db.Orders.FindAsync(id);
        if (order is null) return NotFound();

        order.Status = dto.Status;
        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return NoContent();
    }

    private static OrderResponseDto MapToResponse(Order o) => new(
        o.Id, o.Status, o.Total,
        o.CustomerName, o.CustomerEmail, o.CustomerPhone,
        o.Address, o.City, o.Notes,
        o.CreatedAt, o.UpdatedAt,
        o.Items.Select(i => new OrderItemResponseDto(
            i.Id, i.ProductId, i.ProductName, i.PricePaid, i.Quantity
        )).ToList()
    );
}
