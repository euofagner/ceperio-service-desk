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
        var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId) ?? 
            throw new KeyNotFoundException("Ticket não encontrado.");

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? 
            throw new KeyNotFoundException("Usuário não encontrado.");

        if (user.Role == UserRoles.User)
        {
            if (ticket.CreatedByUserId != userId)
                throw new UnauthorizedAccessException("Você não tem permissão para comentar neste ticket.");
        }
        else if (user.Role == UserRoles.Agent)
        {
            if (ticket.AssignedAgentId != userId)
                throw new UnauthorizedAccessException("Você não está atribuído a este ticket.");
        }
        else if (user.Role != UserRoles.Admin)
        {
            throw new UnauthorizedAccessException("Perfil sem permissão para comentar.");
        }

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
        
        var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId) ?? 
            throw new KeyNotFoundException("Ticket não encontrado.");

        if (userRole == UserRoles.User)
        {
            if (ticket.CreatedByUserId != userId)
                throw new UnauthorizedAccessException("Você não tem permissão para visualizar os comentários deste ticket.");
        }
        else if (userRole == UserRoles.Agent)
        {
            if (ticket.AssignedAgentId != userId)
                throw new UnauthorizedAccessException("Você não está atribuído a este ticket.");
        }
        else if (userRole != UserRoles.Admin)
        {
            throw new UnauthorizedAccessException("Perfil sem permissão para visualizar comentários.");
        }

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
