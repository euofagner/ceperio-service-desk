using CeperioServiceDesk.API.Data;
using CeperioServiceDesk.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CeperioServiceDesk.API.Services;

public class TicketService(AppDbContext dbContext) : ITicketService
{
    private readonly AppDbContext _context = dbContext;

    public async Task<Pagination<Ticket>> GetTickets(string? search = null, int page = 1, int pageSize = 10)
    {
        page = Pagination<Ticket>.ValidatePage(page);
        pageSize = Pagination<Ticket>.ValidatePageSize(pageSize);

        var query = _context.Tickets.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(t => t.Title.Contains(search) || t.Description.Contains(search));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new Pagination<Ticket>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<Ticket?> GetTicket(int id)
    {
        return await _context.Tickets.FindAsync(id);
    }

    public async Task<object> GetSummary()
    {
        return new
        {
            total = await _context.Tickets.CountAsync(),
            open = await _context.Tickets.CountAsync(t => t.TicketStatus == TicketStatus.Open),
            inProgress = await _context.Tickets.CountAsync(t => t.TicketStatus == TicketStatus.InProgress),
            resolved = await _context.Tickets.CountAsync(t => t.TicketStatus == TicketStatus.Resolved),
            closed = await _context.Tickets.CountAsync(t => t.TicketStatus == TicketStatus.Closed)
        };
    }

    public async Task<Ticket> CreateTicket(Ticket ticket)
    {
        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();
        return ticket;
    }

    public async Task<Ticket?> UpdateTicket(int id, Ticket ticket)
    {
        var existingTicket = await _context.Tickets.FindAsync(id);

        if (existingTicket is null) return null;

        existingTicket.Title = ticket.Title;
        existingTicket.Description = ticket.Description;
        existingTicket.TicketStatus = ticket.TicketStatus;
        existingTicket.TicketPriority = ticket.TicketPriority;
        existingTicket.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existingTicket; 
    }

    public async Task<bool> DeleteTicket(int id)
    {
        var existingTicket = await _context.Tickets.FindAsync(id);

        if (existingTicket is null) return false;

        _context.Tickets.Remove(existingTicket);
        await _context.SaveChangesAsync();
        return true;
    }
}
