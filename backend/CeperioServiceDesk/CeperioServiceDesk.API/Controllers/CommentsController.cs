using CeperioServiceDesk.API.DTOs.Comments;
using CeperioServiceDesk.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CeperioServiceDesk.API.Controllers;

[Authorize]
[Route("api/Tickets/{ticketId:int}/comments")]
[ApiController]
public class CommentsController(ICommentService service) : ControllerBase
{
    private readonly ICommentService _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommentResponseDto>>> GetComments(int ticketId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId)) return Unauthorized();

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        if (string.IsNullOrWhiteSpace(userRole)) return Unauthorized();

        var comments = await _service.GetCommentsAsync(ticketId, userId, userRole);
        return Ok(comments);
    }

    [HttpPost]
    public async Task<ActionResult<CommentResponseDto>> CreateComment(int ticketId, CreateCommentDto createCommentDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId)) return Unauthorized();

        var comment = await _service.CreateCommentAsync(ticketId, createCommentDto, userId);
        return Ok(comment);
    }

    [HttpPost("internal")]
    [Authorize(Roles = "Agent,Admin")]
    public async Task<ActionResult<CommentResponseDto>> CreateInternalComment(int ticketId, CreateCommentDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId)) return Unauthorized();

        var comment = await _service.CreateInternalCommentAsync(ticketId, dto, userId);
        return Ok(comment);
    }
}
