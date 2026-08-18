using CeperioServiceDesk.API.Data;
using CeperioServiceDesk.API.DTOs.Tickets;
using CeperioServiceDesk.API.Mappers;
using CeperioServiceDesk.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CeperioServiceDesk.API.Services;

public class TicketService(AppDbContext dbContext) : ITicketService
{
    private readonly AppDbContext _context = dbContext;

    public async Task<Pagination<TicketResponseDto>> GetTickets(string? search = null, TicketStatus? status = null, int page = 1, int pageSize = 5)
    {
        page = Pagination<TicketResponseDto>.ValidatePage(page);
        pageSize = Pagination<TicketResponseDto>.ValidatePageSize(pageSize);

        var query = _context.Tickets.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(t => t.Title.Contains(search) || t.Description.Contains(search));

        if (status.HasValue)
            query = query.Where(t => t.TicketStatus == status.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TicketResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                TicketStatus = t.TicketStatus,
                TicketPriority = t.TicketPriority
            })
            .ToListAsync();

        return new Pagination<TicketResponseDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<TicketResponseDto?> GetTicket(int id)
    {
        var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        return ticket?.ToResponseDto();
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

    public async Task<TicketResponseDto> CreateTicket(CreateTicketDto ticket)
    {
        var entity = ticket.ToEntity();
        _context.Tickets.Add(entity);
        await _context.SaveChangesAsync();
        return entity.ToResponseDto();
    }

    public async Task<TicketResponseDto?> UpdateTicket(int id, UpdateTicketDto ticket)
    {
        var existingTicket = await _context.Tickets.FindAsync(id);
        if (existingTicket is null) return null;

        ticket.ApplyTo(existingTicket);
        await _context.SaveChangesAsync();
        return existingTicket.ToResponseDto();
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
