using BCrypt.Net;
using CeperioServiceDesk.API.Data;
using CeperioServiceDesk.API.DTOs.Auth;
using CeperioServiceDesk.API.Models;
using Microsoft.EntityFrameworkCore;


namespace CeperioServiceDesk.API.Services
{
    public class AuthService(AppDbContext dbContext) : IAuthService
    {
        private readonly AppDbContext _context = dbContext;

        public async Task<LoginResponseDto?> Register(RegisterDto registerDto)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Email == registerDto.Email);

            if (emailExists) return null;

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "User",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new LoginResponseDto
            {
                UserId = user.Id,
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = user.Role
            };
        }

        public async Task<LoginResponseDto?> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user is null || !user.IsActive) return null;

            var passwordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!passwordValid) return null;

            return new LoginResponseDto
            {
                UserId = user.Id,
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = user.Role
            };
        }
    }
}
