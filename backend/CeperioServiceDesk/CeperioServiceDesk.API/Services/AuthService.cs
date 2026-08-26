using BCrypt.Net;
using CeperioServiceDesk.API.Configuration;
using CeperioServiceDesk.API.Data;
using CeperioServiceDesk.API.DTOs.Auth;
using CeperioServiceDesk.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace CeperioServiceDesk.API.Services
{
    public class AuthService(AppDbContext dbContext, IOptions<JwtSettings> jwtSettings) : IAuthService
    {
        private readonly AppDbContext _context = dbContext;
        private readonly JwtSettings _jwtSettings = jwtSettings.Value;

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
            return CreateLoginResponse(user);
        }

        public async Task<LoginResponseDto?> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user is null || !user.IsActive) return null;

            var passwordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!passwordValid) return null;

            return CreateLoginResponse(user);
        }

        private LoginResponseDto CreateLoginResponse(User user)
        {
            return new LoginResponseDto
            {
                Token = GenerateToken(user),
                UserId = user.Id,
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = user.Role
            };
        }

        private string GenerateToken(User user) 
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
