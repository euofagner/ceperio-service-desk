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

    [HttpGet("{id:int}", Name = "ObterTicket")]
    public async Task<ActionResult<Ticket>> GetTicket(int id)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket is null)
            return NotFound($"Ticket de id: {id} não encontrado.");

        return Ok(ticket);
    }

    [HttpPost]
    public async Task<ActionResult> PostTicket(Ticket ticket)
    {
        if (ticket is null) return BadRequest();

        await _context.Tickets.AddAsync(ticket);
        await _context.SaveChangesAsync();

        return new CreatedAtRouteResult("ObterTicket", new { id = ticket.Id }, ticket);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> PutTicket(int id, Ticket ticket)
    {
        if (id != ticket.Id)
            return BadRequest("O id da rota não corresponde ao id do ticket");

        var existingTicket = await _context.Tickets.FindAsync(id);

        if (existingTicket is null) 
            return NotFound($"Ticket de id: {id} não encontrado.");

        existingTicket.Title = ticket.Title;
        existingTicket.Description = ticket.Description;
        existingTicket.TicketStatus = ticket.TicketStatus;
        existingTicket.TicketPriority = ticket.TicketPriority;

        await _context.SaveChangesAsync();

        return Ok(ticket);
    }
}
