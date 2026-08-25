using CeperioServiceDesk.API.DTOs.Auth;

namespace CeperioServiceDesk.API.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> Register(RegisterDto registerDto);
    Task<LoginResponseDto?> Login(LoginDto loginDto);
}
