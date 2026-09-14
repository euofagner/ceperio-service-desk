using CeperioServiceDesk.API.Data;
using CeperioServiceDesk.API.DTOs.Comments;
using CeperioServiceDesk.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CeperioServiceDesk.API.Services;

public class CommentService(AppDbContext dbContext) : ICommentService
{
    private readonly AppDbContext _context = dbContext;

    public async Task<CommentResponseDto> CreateCommentAsync(int ticketId, CreateCommentDto createCommentDto, int userId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId) ?? throw new KeyNotFoundException("Ticket não encontrado.");
        var user = await _context.Users.FindAsync(userId) ?? throw new KeyNotFoundException("Usuário não encontrado.");

        var comment = new Comment
        {
            TicketId = ticketId,
            UserId = userId,
            Content = createCommentDto.Content,
            IsInternal = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return new CommentResponseDto
        {
            Id = comment.Id,
            TicketId = comment.TicketId,
            UserId = comment.UserId,
            UserName = user.Name ?? string.Empty,
            Content = comment.Content,
            IsInternal = comment.IsInternal,
            CreatedAt = comment.CreatedAt
        };
    }

    public async Task<IEnumerable<CommentResponseDto>> GetCommentsAsync(int ticketId, int userId, string userRole)
    {
        var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == ticketId);
        if (!ticketExists) throw new KeyNotFoundException("Ticket não encontrado.");

        var query = _context.Comments.Where(c => c.TicketId == ticketId);

        if (userRole == UserRoles.User)
            query = query.Where(c => !c.IsInternal);

        return await query
            .OrderBy(c => c.CreatedAt)
            .Select(c => new CommentResponseDto
            {
                Id = c.Id,
                TicketId = c.TicketId,
                UserId = c.UserId,
                UserName = c.User.Name ?? string.Empty,
                Content = c.Content,
                IsInternal = c.IsInternal,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
    }
}
