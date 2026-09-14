using System.ComponentModel.DataAnnotations;

namespace CeperioServiceDesk.API.DTOs.Comments;

public class CreateCommentDto
{
    [Required]
    [StringLength(1000)]
    public string Content { get; set; } = string.Empty;
}
