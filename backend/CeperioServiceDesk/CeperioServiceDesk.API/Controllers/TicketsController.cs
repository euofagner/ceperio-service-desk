using CeperioServiceDesk.API.DTOs.Tickets;
using CeperioServiceDesk.API.Models;
using CeperioServiceDesk.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CeperioServiceDesk.API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class TicketsController(ITicketService service) : ControllerBase
{
    private readonly ITicketService _service = service;

    [Authorize(Roles = "admin")]
    [HttpGet("admin-test")]
    public IActionResult AdminTest()
    {
        return Ok(new
        {
            message = "Você é administrador."
        });
    }

    [HttpGet]
    public async Task<ActionResult<Pagination<TicketResponseDto>>> GetTickets(
        [FromQuery] string? search,
        [FromQuery] TicketStatus? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
    {
        var tickets = await _service.GetTickets(search, status, page, pageSize);
        return Ok(tickets);
    }

    [HttpGet("{id:int}", Name = "ObterTicket")]
    public async Task<ActionResult<TicketResponseDto>> GetTicket(int id)
    {
        var ticket = await _service.GetTicket(id);
        if (ticket is null)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://httpstatuses.com/404",
                Title = "Ticket não encontrado",
                Detail = $"O ticket de id {id} não foi encontrado.",
                Status = StatusCodes.Status404NotFound
            });
        }
        return Ok(ticket);
    }

    [HttpGet("summary")]
    public async Task<ActionResult> GetSummary()
    {
        var summary = await _service.GetSummary();
        return Ok(summary);
    }

    [HttpPost]
    public async Task<ActionResult<TicketResponseDto>> PostTicket(CreateTicketDto ticket)
    {
        var created = await _service.CreateTicket(ticket);
        return CreatedAtRoute("ObterTicket", new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TicketResponseDto>> PutTicket(int id, UpdateTicketDto ticket)
    {
        var updatedTicket = await _service.UpdateTicket(id, ticket);
        if (updatedTicket is null)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://httpstatuses.com/404",
                Title = "Ticket não encontrado",
                Detail = $"O ticket de id {id} não foi encontrado.",
                Status = StatusCodes.Status404NotFound
            });
        }
        return Ok(updatedTicket);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteTicket(int id)
    {
        var deletedTicket = await _service.DeleteTicket(id);
        if (!deletedTicket)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://httpstatuses.com/404",
                Title = "Ticket não encontrado",
                Detail = $"O ticket de id {id} não foi encontrado.",
                Status = StatusCodes.Status404NotFound
            });
        }
        return NoContent();
    }
}
 