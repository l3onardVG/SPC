namespace SPC.Business.Dtos;

public class AuthorBookMappingConfigDto
{
    public List<AuthorMappingDto> AuthorMappings { get; set; } = new();
    public List<BookAuthorMappingDto> BookAuthorMappings { get; set; } = new();
}

public class AuthorMappingDto
{
    public int JsonAuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorSurname { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class BookAuthorMappingDto
{
    public string BookName { get; set; } = string.Empty;
    public int JsonAuthorId { get; set; }
    public string ExpectedAuthor { get; set; } = string.Empty;
} 