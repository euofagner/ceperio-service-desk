using System.ComponentModel.DataAnnotations;

namespace CeperioServiceDesk.API.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string? Name { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string? Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string Role { get; set; } = "User";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
