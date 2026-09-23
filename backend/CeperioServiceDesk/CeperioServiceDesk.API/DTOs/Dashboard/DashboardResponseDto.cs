using CeperioServiceDesk.API.DTOs.Tickets;
using CeperioServiceDesk.API.Models;

namespace CeperioServiceDesk.API.DTOs.Dashboard;

public class DashboardResponseDto
{
    public DashboardSummaryDto Summary { get; set; } = new();
    public IEnumerable<TicketResponseDto> RecentTickets { get; set; } = [];
    public IEnumerable<DashboardStatusDto> TicketsByStatus { get; set; } = [];
    public IEnumerable<DashboardAgentDto> TicketsByAgent { get; set; } = [];
    public IEnumerable<DashboardPeriodDto> TicketsByPeriod { get; set; } = [];
}

public class DashboardSummaryDto
{
    public int Total { get; set; }
    public int Open { get; set; }
    public int InProgress { get; set; }
    public int WaitingUser { get; set; }
    public int Resolved { get; set; }
    public int Closed { get; set; }
}

public class DashboardStatusDto
{
    public TicketStatus Status { get; set; }
    public int Count { get; set; }
}

public class DashboardAgentDto
{
    public int? AgentId { get; set; }
    public string AgentName { get; set; } = string.Empty;
    public int TicketCount { get; set; }
}

public class DashboardPeriodDto
{
    public DateTime Date { get; set; }
    public int Open { get; set; }
    public int InProgress { get; set; }
    public int WaitingUser { get; set; }
    public int Resolved { get; set; }
    public int Closed { get; set; }
}