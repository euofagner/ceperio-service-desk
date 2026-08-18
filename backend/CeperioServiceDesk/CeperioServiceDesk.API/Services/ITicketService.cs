using CeperioServiceDesk.API.DTOs.Tickets;
using CeperioServiceDesk.API.Models;

namespace CeperioServiceDesk.API.Services;

public interface ITicketService
{
    Task<Pagination<TicketResponseDto>> GetTickets(string? search = null, TicketStatus? status = null, int page = 1, int pageSize = 5);
    Task<TicketResponseDto?> GetTicket(int id);
    Task<object> GetSummary();
    Task<TicketResponseDto> CreateTicket(CreateTicketDto ticket);
    Task<TicketResponseDto?> UpdateTicket(int id, UpdateTicketDto ticket);
    Task<bool> DeleteTicket(int id);
}
