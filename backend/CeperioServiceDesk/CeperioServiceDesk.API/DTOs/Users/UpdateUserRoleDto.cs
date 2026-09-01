using System.ComponentModel.DataAnnotations;

namespace CeperioServiceDesk.API.DTOs.Users;

public class UpdateUserRoleDto
{
    [Required]
    public string Role { get; set; } = string.Empty;
}
