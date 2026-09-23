using CeperioServiceDesk.API.Data;
using CeperioServiceDesk.API.DTOs.Dashboard;
using CeperioServiceDesk.API.DTOs.Tickets;
using CeperioServiceDesk.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CeperioServiceDesk.API.Services;

public class DashboardService(AppDbContext dbContext) : IDashboardService
{
    private readonly AppDbContext _context = dbContext;

    public async Task<DashboardResponseDto> GetDashboardAsync(int userId, string userRole, int days = 7)
    {
        days = ValidateDays(days);

        var baseQuery = _context.Tickets.AsNoTracking().AsQueryable();

        if (userRole == UserRoles.User)
            baseQuery = baseQuery.Where(t => t.CreatedByUserId == userId);

        var tickets = await baseQuery
            .Select(t => new DashboardTicketData
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                TicketStatus = t.TicketStatus,
                TicketPriority = t.TicketPriority,
                CreatedByUserId = t.CreatedByUserId,
                CreatedByUserName = t.CreatedByUser != null ? t.CreatedByUser.Name : null,
                AssignedAgentId = t.AssignedAgentId,
                AssignedAgentName = t.AssignedAgent != null ? t.AssignedAgent.Name : null
            })
            .ToListAsync();

        return new DashboardResponseDto
        {
            Summary = CreateSummary(tickets),
            RecentTickets = CreateRecentTickets(tickets),
            TicketsByStatus = CreateTicketsByStatus(tickets),
            TicketsByAgent = CreateTicketsByAgent(tickets),
            TicketsByPeriod = await CreateTicketsByPeriodAsync(baseQuery, days)
        };
    }

    private static DashboardSummaryDto CreateSummary(IEnumerable<DashboardTicketData> tickets) => new()
    {
        Total = tickets.Count(),
        Open = tickets.Count(t => t.TicketStatus == TicketStatus.Open),
        InProgress = tickets.Count(t => t.TicketStatus == TicketStatus.InProgress),
        WaitingUser = tickets.Count(t => t.TicketStatus == TicketStatus.WaitingUser),
        Resolved = tickets.Count(t => t.TicketStatus == TicketStatus.Resolved),
        Closed = tickets.Count(t => t.TicketStatus == TicketStatus.Closed)
    };

    private static IEnumerable<TicketResponseDto> CreateRecentTickets(IEnumerable<DashboardTicketData> tickets)
    {
        return tickets
            .OrderByDescending(t => t.UpdatedAt ?? t.CreatedAt)
            .Take(5)
            .Select(t => new TicketResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                TicketStatus = t.TicketStatus,
                TicketPriority = t.TicketPriority,
                CreatedByUserId = t.CreatedByUserId,
                CreatedByUserName = t.CreatedByUserName,
                AssignedAgentId = t.AssignedAgentId,
                AssignedAgentName = t.AssignedAgentName
            });
    }

    private static IEnumerable<DashboardStatusDto> CreateTicketsByStatus(IEnumerable<DashboardTicketData> tickets)
    {
        return tickets
            .GroupBy(t => t.TicketStatus)
            .Select(g => new DashboardStatusDto { Status = g.Key, Count = g.Count() })
            .OrderBy(item => item.Status);
    }

    private static IEnumerable<DashboardAgentDto> CreateTicketsByAgent(IEnumerable<DashboardTicketData> tickets)
    {
        return tickets
            .GroupBy(t => new { t.AssignedAgentId, t.AssignedAgentName })
            .Select(g => new DashboardAgentDto
            {
                AgentId = g.Key.AssignedAgentId,
                AgentName = g.Key.AssignedAgentName ?? "Não atribuído",
                TicketCount = g.Count()
            })
            .OrderByDescending(item => item.TicketCount);
    }

    private async Task<IEnumerable<DashboardPeriodDto>> CreateTicketsByPeriodAsync(IQueryable<Ticket> baseQuery, int days)
    {
        var startDate = DateTime.UtcNow.Date.AddDays(-(days - 1));

        var periodTickets = await baseQuery
            .Where(t => t.CreatedAt >= startDate)
            .Select(t => new { t.CreatedAt, t.TicketStatus })
            .ToListAsync();

        return Enumerable.Range(0, days).Select(offset =>
        {
            var date = startDate.AddDays(offset);
            var dayTickets = periodTickets.Where(t => t.CreatedAt.Date == date);

            return new DashboardPeriodDto
            {
                Date = date,
                Open = dayTickets.Count(t => t.TicketStatus == TicketStatus.Open),
                InProgress = dayTickets.Count(t => t.TicketStatus == TicketStatus.InProgress),
                WaitingUser = dayTickets.Count(t => t.TicketStatus == TicketStatus.WaitingUser),
                Resolved = dayTickets.Count(t => t.TicketStatus == TicketStatus.Resolved),
                Closed = dayTickets.Count(t => t.TicketStatus == TicketStatus.Closed)
            };
        }).ToList();
    }

    private static int ValidateDays(int days) => days switch
    {
        7 or 30 or 90 => days,
        _ => throw new ArgumentException("O período deve ser 7, 30 ou 90 dias.")
    };

    private class DashboardTicketData
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public TicketStatus TicketStatus { get; set; }
        public TicketPriority TicketPriority { get; set; }
        public int? CreatedByUserId { get; set; }
        public string? CreatedByUserName { get; set; }
        public int? AssignedAgentId { get; set; }
        public string? AssignedAgentName { get; set; }
    }
}