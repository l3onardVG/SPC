namespace SPC.Business.Dtos;

public class BookDetailDto
{
    public int AuthorId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string IsbN13 { get; set; } = string.Empty;
    public string Editorial { get; set; } = string.Empty;
    public int YearOfPubliction { get; set; }
    public int Format { get; set; }
    public int Genrre { get; set; }
    public string Language { get; set; } = string.Empty;
    public string Cover { get; set; } = string.Empty;
    public string Edition { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public bool Deleted { get; set; }
    public int Long { get; set; }
    public double AverageRating { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public object? Author { get; set; }
    public int Id { get; set; }
    public bool IsCurrentUserRated { get; set; }
} 