using System.ComponentModel.DataAnnotations;

namespace CeperioServiceDesk.API.Models;

public class Comment
{
    public int Id { get; set; }

    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    [StringLength(1000)]
    public string Content { get; set; } = string.Empty;

    public bool IsInternal { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
