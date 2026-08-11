using CeperioServiceDesk.API.Models;

namespace CeperioServiceDesk.API.Services;

public interface ITicketService
{
    Task<Pagination<Ticket>> GetTickets(string? search = null, TicketStatus? status = null, int page = 1, int pageSize = 5);
    Task<Ticket?> GetTicket(int id);
    Task<object> GetSummary();
    Task<Ticket> CreateTicket(Ticket ticket);
    Task<Ticket?> UpdateTicket(int id, Ticket ticket);
    Task<bool> DeleteTicket(int id); 
}
