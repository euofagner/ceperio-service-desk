using CeperioServiceDesk.API.DTOs.Tickets;
using CeperioServiceDesk.API.Models;

namespace CeperioServiceDesk.API.Mappers;

public static class TicketMapper
{
    public static TicketResponseDto ToResponseDto(this Ticket ticket)
    {
        return new TicketResponseDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt,
            TicketStatus = ticket.TicketStatus,
            TicketPriority = ticket.TicketPriority
        };
    }

    public static Ticket ToEntity(this CreateTicketDto dto)
    {
        return new Ticket
        {
            Title = dto.Title,
            Description = dto.Description,
            TicketPriority = dto.TicketPriority,
            TicketStatus = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow
        };
    }

    public static void ApplyTo(this UpdateTicketDto dto, Ticket ticket)
    {
        ticket.Title = dto.Title;
        ticket.Description = dto.Description;
        ticket.TicketStatus = dto.TicketStatus;
        ticket.TicketPriority = dto.TicketPriority;
        ticket.UpdatedAt = DateTime.UtcNow;
    }
}
