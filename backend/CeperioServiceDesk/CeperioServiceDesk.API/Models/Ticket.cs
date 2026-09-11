using System.ComponentModel.DataAnnotations;

namespace CeperioServiceDesk.API.Models;

public class Ticket
{
    public int Id { get; set; }

    public int? AssignedAgentId { get; set; }
    public User? AssignedAgent { get; set; }

    [Required]
    [StringLength(80)]
    public string Title { get; set; } = string.Empty;

    [StringLength(300)]
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public TicketStatus TicketStatus { get; set; } = TicketStatus.Open;
    public TicketPriority TicketPriority { get; set; } = TicketPriority.Medium;

    public void ChangeStatus(TicketStatus newStatus)
    {
        if (TicketStatus == newStatus) return;

        var validTransition = (TicketStatus, newStatus) switch
        {
            (TicketStatus.Open, TicketStatus.InProgress) => true,

            (TicketStatus.InProgress, TicketStatus.WaitingUser) => true,
            (TicketStatus.WaitingUser, TicketStatus.InProgress) => true,

            (TicketStatus.InProgress, TicketStatus.Resolved) => true,
            (TicketStatus.Resolved, TicketStatus.Closed) => true,
            (TicketStatus.Resolved, TicketStatus.InProgress) => true,

            _ => false
        };

        if (!validTransition)
        {
            throw new InvalidOperationException(
                $"Não é possível alterar o status de {TicketStatus} para {newStatus}.");
        }

        TicketStatus = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }
}
 
public enum TicketStatus
{
    Open = 0,
    InProgress = 1,
    Resolved = 2,
    Closed = 3,
    WaitingUser = 4
}

public enum TicketPriority
{
    Low,
    Medium,
    High,
    Critical
}
