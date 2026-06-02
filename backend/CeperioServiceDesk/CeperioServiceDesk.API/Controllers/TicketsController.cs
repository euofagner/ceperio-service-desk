using CeperioServiceDesk.API.Data;
using CeperioServiceDesk.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CeperioServiceDesk.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TicketsController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets()
    {
        var tickets = await _context.Tickets.ToListAsync();
        return Ok(tickets);
    }

    [HttpPost]
    public async Task<ActionResult> PostTicket(Ticket ticket)
    {
        if (ticket is null) return BadRequest();

        await _context.Tickets.AddAsync(ticket);
        await _context.SaveChangesAsync();

        return Created();
    }
}
