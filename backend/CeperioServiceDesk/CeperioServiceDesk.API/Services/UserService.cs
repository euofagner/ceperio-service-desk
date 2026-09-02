using CeperioServiceDesk.API.Data;
using CeperioServiceDesk.API.DTOs.Users;
using Microsoft.EntityFrameworkCore;

namespace CeperioServiceDesk.API.Services;

public class UserService(AppDbContext dbContext) : IUserService
{
    private readonly AppDbContext _context = dbContext;

    public async Task<IEnumerable<UserResponseDto>> GetUsersAsync()
    {
        return await _context.Users
            .Select(user => new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                IsActive = user.IsActive
            }).ToListAsync();
    }

    public async Task<UserResponseDto?> GetUserAsync(int id)
    {
        return await _context.Users
            .Where(user => user.Id == id)
            .Select(user => new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                IsActive = user.IsActive
            }).FirstOrDefaultAsync();
    }

    public async Task<UserResponseDto?> UpdateRole(int id, UpdateUserRoleDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(user => user.Id == id);

        if (user is null) return null;

        user.ChangeRole(dto.Role);
        await _context.SaveChangesAsync();

        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name ?? string.Empty,
            Email = user.Email ?? string.Empty,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            IsActive = user.IsActive
        };
    }
}
