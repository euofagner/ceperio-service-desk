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
    public string Role { get; private set; } = UserRoles.User;

    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public bool IsActive { get; private set; } = true;
    public int TokenVersion { get; private set; } = 0;

    public void ChangeRole(string role)
    {
        if (role != UserRoles.User && role != UserRoles.Admin)
            throw new ArgumentException("Perfil inválido. Somente User/Admin");

        Role = role;
        TokenVersion++;
    }
}
