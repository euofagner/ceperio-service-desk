using CeperioServiceDesk.API.Models;
using CeperioServiceDesk.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CeperioServiceDesk.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TicketsController(ITicketService service) : ControllerBase
{
    private readonly ITicketService _service = service;

    [HttpGet]
    public async Task<ActionResult<Pagination<Ticket>>> GetTickets(
        [FromQuery] string? search,
        [FromQuery] TicketStatus? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
    {
        var tickets = await _service.GetTickets(search, status, page, pageSize);
        return Ok(tickets);
    }

    [HttpGet("{id:int}", Name = "ObterTicket")]
    public async Task<ActionResult<Ticket>> GetTicket(int id)
    {
        var ticket = await _service.GetTicket(id);

        if (ticket is null)
        {
            return NotFound(new ProblemDetails 
            {
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
    public async Task<ActionResult> PostTicket(Ticket ticket)
    {
        if (ticket is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Requisição inválida",
                Detail = "Os dados do ticket são obrigatórios.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var created = await _service.CreateTicket(ticket);
        return new CreatedAtRouteResult("ObterTicket", new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> PutTicket(int id, Ticket ticket)
    {
        if (id != ticket.Id)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "ID inválido",
                Detail = "O ID informado na rota não corresponde ao ID do ticket.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var updatedTicket = await _service.UpdateTicket(id, ticket);

        if (updatedTicket is null)
        {
            return NotFound(new ProblemDetails
            {
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
                Title = "Ticket não encontrado",
                Detail = $"O ticket de id {id} não foi encontrado.",
                Status = StatusCodes.Status404NotFound
            });
        }

        return NoContent();
    }
}
 