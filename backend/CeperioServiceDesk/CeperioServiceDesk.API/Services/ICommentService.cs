using CeperioServiceDesk.API.DTOs.Comments;

namespace CeperioServiceDesk.API.Services;

public interface ICommentService
{
    Task<CommentResponseDto> CreateCommentAsync(int ticketId, CreateCommentDto createCommentDto, int userId);
    Task<IEnumerable<CommentResponseDto>> GetCommentsAsync(int ticketId, int userId, string userRole);
    Task<CommentResponseDto> RequestInformationAsync(int ticketId, CreateCommentDto dto, int agentId);
}