using CeperioServiceDesk.API.Models;
using System.ComponentModel.DataAnnotations;

namespace CeperioServiceDesk.API.DTOs.Tickets;

public class UpdateTicketDto
{
    [Required]
    [StringLength(80)]
    public string Title { get; set; } = string.Empty;

    [StringLength(300)]
    public string Description { get; set; } = string.Empty;

    public TicketStatus TicketStatus { get; set; }
    public TicketPriority TicketPriority { get; set; }
}
