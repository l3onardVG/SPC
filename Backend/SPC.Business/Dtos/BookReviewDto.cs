namespace SPC.Business.Dtos;

public class BookReviewResponseDto
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string UserSurname { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool IsCurrentUserReview { get; set; }
} 