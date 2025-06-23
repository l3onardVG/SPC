namespace SPC.Business.Dtos;

public class SeedDataDto
{
    public List<AuthorSeedDto> Authors { get; set; } = new();
    public List<BookSeedDto> Books { get; set; } = new();
    public List<AuthorBookMappingDto> AuthorBookMappings { get; set; } = new();
}

public class AuthorSeedDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string About { get; set; } = string.Empty;
    public bool IsAlive { get; set; }
    public bool Deleted { get; set; }
}

public class BookSeedDto
{
    public int AuthorId { get; set; } // ID ficticio del JSON
    public string Name { get; set; } = string.Empty;
    public string ISBN13 { get; set; } = string.Empty;
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
}

public class AuthorBookMappingDto
{
    public int JsonAuthorId { get; set; } // ID del JSON (1, 2, 3, etc.)
    public string AuthorName { get; set; } = string.Empty; // Nombre del autor para verificación
    public string AuthorSurname { get; set; } = string.Empty; // Apellido del autor para verificación
} 