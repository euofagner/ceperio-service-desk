using System.ComponentModel.DataAnnotations;

namespace CeperioServiceDesk.API.Models;

public class User(string name, string email, string passwordHash)
{
    public int Id { get; private set; }

    [Required]
    [StringLength(100)]
    public string? Name { get; private set; } = name;

    [Required]
    [StringLength(150)]
    public string? Email { get; private set; } = email;

    [Required]
    public string PasswordHash { get; private set; } = passwordHash;

    [Required]
    [StringLength(30)]
    public string Role { get; private set; } = "User";

    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public bool IsActive { get; private set; } = true;

    public void ChangeRole(string role)
    {
        if (string.IsNullOrWhiteSpace(role))
            throw new ArgumentException("O perfil é obrigatório.");

        Role = role;
    }
}
