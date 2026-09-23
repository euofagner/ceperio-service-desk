using CeperioServiceDesk.API.DTOs.Dashboard;
using CeperioServiceDesk.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CeperioServiceDesk.API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DashboardController(IDashboardService service) : ControllerBase
{
    private readonly IDashboardService _service = service;

    [HttpGet]
    public async Task<ActionResult<DashboardResponseDto>> GetDashboard([FromQuery] int days = 7)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId)) return Unauthorized();

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        if (string.IsNullOrWhiteSpace(userRole)) return Unauthorized();

        var dashboard = await _service.GetDashboardAsync(userId, userRole, days);
        return Ok(dashboard);
    }
}