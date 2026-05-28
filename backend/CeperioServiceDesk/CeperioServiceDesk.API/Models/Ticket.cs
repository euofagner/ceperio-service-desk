using System.ComponentModel.DataAnnotations;

namespace CeperioServiceDesk.API.Models;

public class Ticket
{
    public int Id { get; set; }

    [Required]
    [StringLength(80)]
    public string Title { get; set; } = string.Empty;

    [StringLength(300)]
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public TicketStatus TicketStatus { get; set; } = TicketStatus.Open;
    public TicketPriority TicketPriority { get; set; } = TicketPriority.Medium;
}
 
public enum TicketStatus
{
    Open,
    InProgress,
    Resolved,
    Closed
}

public enum TicketPriority
{
    Low,
    Medium,
    High,
    Critical
}
