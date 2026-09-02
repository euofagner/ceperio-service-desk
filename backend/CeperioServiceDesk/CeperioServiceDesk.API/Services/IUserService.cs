using CeperioServiceDesk.API.DTOs.Users;

namespace CeperioServiceDesk.API.Services;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetUsersAsync();
    Task<UserResponseDto?> GetUserAsync(int id);
    Task<UserResponseDto?> UpdateRole(int id, UpdateUserRoleDto dto);
}
