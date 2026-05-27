namespace CeperioServiceDesk.API.Models;

public class Ticket
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
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
