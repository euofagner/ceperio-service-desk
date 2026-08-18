using CeperioServiceDesk.API.Models;

namespace CeperioServiceDesk.API.DTOs.Tickets;

public class TicketResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public TicketStatus TicketStatus { get; set; }
    public TicketPriority TicketPriority { get; set; }
}
