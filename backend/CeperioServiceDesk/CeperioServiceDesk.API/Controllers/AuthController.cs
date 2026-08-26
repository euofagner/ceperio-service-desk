using CeperioServiceDesk.API.DTOs.Auth;
using CeperioServiceDesk.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CeperioServiceDesk.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(IAuthService service) : ControllerBase
{
    private readonly IAuthService _service = service;

    [HttpPost("register")]
    public async Task<ActionResult<LoginResponseDto>> Register(RegisterDto registerDto)
    {
        var result = await _service.Register(registerDto);

        if (result is null)
        {
            return Conflict(new ProblemDetails
            {
                Type = "https://httpstatuses.com/409",
                Title = "Email já cadastrado",
                Status = StatusCodes.Status409Conflict,
                Detail = "Já existe um usuário cadastrado com este email",
                Instance = HttpContext.Request.Path
            });
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
    {
        var result = await _service.Login(loginDto);

        if (result is null)
        {
            return Unauthorized(new ProblemDetails
            {
                Type = "https://httpstatuses.com/401",
                Title = "Credenciais inválidas",
                Status = StatusCodes.Status401Unauthorized,
                Detail = "Email ou senha inválidos.",
                Instance = HttpContext.Request.Path
            });
        }

        return Ok(result);
    }
}
