using CeperioServiceDesk.API.DTOs.Users;
using CeperioServiceDesk.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CeperioServiceDesk.API.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
[ApiController]
public class UsersController(IUserService service) : ControllerBase
{
    private readonly IUserService _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
    {
        var users = await _service.GetUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}", Name = "ObterUsuario")]
    public async Task<ActionResult<UserResponseDto>> GetUser(int id)
    {
        var user = await _service.GetUserAsync(id);

        if (user is null)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://httpstatuses.com/404",
                Title = "Usuário não encontrado",
                Status = StatusCodes.Status404NotFound,
                Detail = $"O usuário de id {id} não foi encontrado.",
                Instance = HttpContext.Request.Path
            });
        }

        return Ok(user);
    }

    [HttpPut("{id:int}/role")]
    public async Task<ActionResult<UserResponseDto>> UpdateRole(int id, UpdateUserRoleDto dto)
    {
        var user = await _service.UpdateRole(id, dto);

        if (user is null)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://httpstatuses.com/404",
                Title = "Usuário não encontrado",
                Status = StatusCodes.Status404NotFound,
                Detail = $"O usuário de id {id} não foi encontrado.",
                Instance = HttpContext.Request.Path
            });
        }

        return Ok(user);
    }
}