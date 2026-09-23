using CeperioServiceDesk.API.DTOs.Dashboard;

namespace CeperioServiceDesk.API.Services;

public interface IDashboardService
{
    Task<DashboardResponseDto> GetDashboardAsync(int userId, string userRole, int days = 7);
}