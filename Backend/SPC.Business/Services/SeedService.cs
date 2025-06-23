using System.Text.Json;
using Microsoft.Extensions.Logging;
using SPC.Business.Dtos;
using SPC.Data.Models;
using SPC.Data;

namespace SPC.Business.Services;

public interface ISeedService
{
    Task SeedDataFromJsonAsync();
    Task SeedAuthorsAsync();
    Task SeedBooksAsync();
}

public class SeedService : ISeedService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SeedService> _logger;

    public SeedService(IUnitOfWork unitOfWork, ILogger<SeedService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task SeedDataFromJsonAsync()
    {
        try
        {
            _logger.LogInformation("Iniciando proceso de seeding desde JSON...");

            // Cargar datos del JSON
            var seedData = await LoadSeedDataAsync();
            if (seedData == null)
            {
                _logger.LogWarning("No se pudo cargar el archivo de datos de seeding");
                return;
            }

            // Cargar configuración de mapeo
            var mappingConfig = await LoadMappingConfigAsync();
            if (mappingConfig == null)
            {
                _logger.LogWarning("No se pudo cargar la configuración de mapeo");
                return;
            }

            // Verificar si ya hay datos
            var existingAuthors = await _unitOfWork.AuthorRepository.GetAllAsync();
            var existingBooks = await _unitOfWork.BookRepository.GetAllAsync();

            if (existingAuthors.Any() || existingBooks.Any())
            {
                _logger.LogInformation("Ya existen datos en la base de datos. Saltando seeding...");
                return;
            }

            // Seed de autores primero
            var authorMappings = await SeedAuthorsAsync(seedData.Authors, mappingConfig.AuthorMappings);

            // Seed de libros después usando el mapeo
            await SeedBooksAsync(seedData.Books, authorMappings, mappingConfig.BookAuthorMappings);

            _logger.LogInformation("Proceso de seeding completado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el proceso de seeding");
            throw;
        }
    }

    public async Task SeedAuthorsAsync()
    {
        try
        {
            var seedData = await LoadSeedDataAsync();
            var mappingConfig = await LoadMappingConfigAsync();
            if (seedData?.Authors != null && mappingConfig?.AuthorMappings != null)
            {
                await SeedAuthorsAsync(seedData.Authors, mappingConfig.AuthorMappings);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el seeding de autores");
            throw;
        }
    }

    public async Task SeedBooksAsync()
    {
        try
        {
            var seedData = await LoadSeedDataAsync();
            var mappingConfig = await LoadMappingConfigAsync();
            if (seedData?.Books != null && mappingConfig?.BookAuthorMappings != null)
            {
                // Crear mapeo de autores
                var authors = await _unitOfWork.AuthorRepository.GetAllAsync();
                var authorMappings = CreateAuthorMappings(seedData.Authors, authors.ToList(), mappingConfig.AuthorMappings);
                await SeedBooksAsync(seedData.Books, authorMappings, mappingConfig.BookAuthorMappings);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el seeding de libros");
            throw;
        }
    }

    private async Task<SeedDataDto?> LoadSeedDataAsync()
    {
        try
        {
            // Intentar diferentes rutas para el archivo JSON
            var possiblePaths = new[]
            {
                "/app/DB.json", // Ruta en el contenedor Docker
                Path.Combine(Directory.GetCurrentDirectory(), "DB.json"), // Ruta local
                Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "DB", "DB.json"), // Ruta relativa
                Path.Combine(Directory.GetCurrentDirectory(), "..", "DB", "DB.json"), // Ruta alternativa
                Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "SPC.Data", "Data", "DB.json"), // Nueva ruta en SPC.Data
                Path.Combine(Directory.GetCurrentDirectory(), "..", "SPC.Data", "Data", "DB.json") // Ruta alternativa en SPC.Data
            };

            string? jsonPath = null;
            foreach (var path in possiblePaths)
            {
                if (File.Exists(path))
                {
                    jsonPath = path;
                    break;
                }
            }

            if (jsonPath == null)
            {
                _logger.LogWarning($"Archivo DB.json no encontrado en ninguna de las rutas: {string.Join(", ", possiblePaths)}");
                return null;
            }

            _logger.LogInformation($"Cargando datos desde: {jsonPath}");

            var jsonContent = await File.ReadAllTextAsync(jsonPath);
            var seedData = JsonSerializer.Deserialize<SeedDataDto>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return seedData;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al cargar el archivo JSON de seeding");
            return null;
        }
    }

    private async Task<AuthorBookMappingConfigDto?> LoadMappingConfigAsync()
    {
        try
        {
            // Intentar diferentes rutas para el archivo de mapeo
            var possiblePaths = new[]
            {
                "/app/AuthorBookMapping.json", // Ruta en el contenedor Docker
                Path.Combine(Directory.GetCurrentDirectory(), "AuthorBookMapping.json"), // Ruta local
                Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "SPC.Business", "Data", "AuthorBookMapping.json"), // Ruta relativa
                Path.Combine(Directory.GetCurrentDirectory(), "..", "SPC.Business", "Data", "AuthorBookMapping.json"), // Ruta alternativa
                Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "SPC.Data", "Data", "AuthorBookMapping.json"), // Nueva ruta en SPC.Data
                Path.Combine(Directory.GetCurrentDirectory(), "..", "SPC.Data", "Data", "AuthorBookMapping.json") // Ruta alternativa en SPC.Data
            };

            string? jsonPath = null;
            foreach (var path in possiblePaths)
            {
                if (File.Exists(path))
                {
                    jsonPath = path;
                    break;
                }
            }

            if (jsonPath == null)
            {
                _logger.LogWarning($"Archivo AuthorBookMapping.json no encontrado en ninguna de las rutas: {string.Join(", ", possiblePaths)}");
                return null;
            }

            _logger.LogInformation($"Cargando configuración de mapeo desde: {jsonPath}");

            var jsonContent = await File.ReadAllTextAsync(jsonPath);
            var mappingConfig = JsonSerializer.Deserialize<AuthorBookMappingConfigDto>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return mappingConfig;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al cargar el archivo de configuración de mapeo");
            return null;
        }
    }

    private async Task<Dictionary<int, int>> SeedAuthorsAsync(List<AuthorSeedDto> authors, List<AuthorMappingDto> authorMappings)
    {
        _logger.LogInformation($"Iniciando seeding de {authors.Count} autores...");

        // Crear mapeo de JSON AuthorId a Database AuthorId
        var authorIdMappings = new Dictionary<int, int>();

        foreach (var mapping in authorMappings)
        {
            // Buscar el autor correspondiente en la lista de autores del JSON
            var authorDto = authors.FirstOrDefault(a => 
                string.Equals(a.Name, mapping.AuthorName, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(a.Surname, mapping.AuthorSurname, StringComparison.OrdinalIgnoreCase));

            if (authorDto != null)
            {
                var author = new Author
                {
                    Name = authorDto.Name,
                    Surname = authorDto.Surname,
                    About = authorDto.About,
                    IsAlive = authorDto.IsAlive,
                    Deleted = authorDto.Deleted
                };

                await _unitOfWork.AuthorRepository.AddAsync(author);
                await _unitOfWork.SaveAsync();

                // Mapear el JSON AuthorId al Database AuthorId
                authorIdMappings[mapping.JsonAuthorId] = author.Id;

                _logger.LogInformation($"Autor agregado: {author.Name} {author.Surname} (JSON ID: {mapping.JsonAuthorId} -> DB ID: {author.Id})");
            }
            else
            {
                _logger.LogWarning($"No se encontró el autor {mapping.AuthorName} {mapping.AuthorSurname} en el JSON para el mapeo {mapping.JsonAuthorId}");
            }
        }

        _logger.LogInformation($"Seeding de autores completado. {authorIdMappings.Count} autores agregados.");
        _logger.LogInformation($"Mapeo de autores creado: {string.Join(", ", authorIdMappings.Select(kvp => $"JSON:{kvp.Key}->DB:{kvp.Value}"))}");
        
        return authorIdMappings;
    }

    private Dictionary<int, int> CreateAuthorMappings(List<AuthorSeedDto> jsonAuthors, List<Author> dbAuthors, List<AuthorMappingDto> authorMappings)
    {
        var mappings = new Dictionary<int, int>();
        
        foreach (var mapping in authorMappings)
        {
            var author = dbAuthors.FirstOrDefault(a => 
                string.Equals(a.Name, mapping.AuthorName, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(a.Surname, mapping.AuthorSurname, StringComparison.OrdinalIgnoreCase));
            
            if (author != null)
            {
                mappings[mapping.JsonAuthorId] = author.Id;
            }
        }
        
        return mappings;
    }

    private async Task SeedBooksAsync(List<BookSeedDto> books, Dictionary<int, int> authorMappings, List<BookAuthorMappingDto> bookAuthorMappings)
    {
        _logger.LogInformation($"Iniciando seeding de {books.Count} libros...");

        var bookEntities = new List<Book>();
        var unmappedBooks = new List<string>();
        var validationErrors = new List<string>();

        foreach (var bookDto in books)
        {
            // Verificar que el mapeo sea correcto según la configuración
            var expectedMapping = bookAuthorMappings.FirstOrDefault(m => 
                string.Equals(m.BookName, bookDto.Name, StringComparison.OrdinalIgnoreCase));

            if (expectedMapping != null && expectedMapping.JsonAuthorId != bookDto.AuthorId)
            {
                validationErrors.Add($"Libro '{bookDto.Name}': AuthorId esperado {expectedMapping.JsonAuthorId}, encontrado {bookDto.AuthorId}");
            }

            if (authorMappings.TryGetValue(bookDto.AuthorId, out var realAuthorId))
            {
                var book = new Book
                {
                    AuthorId = realAuthorId,
                    Name = bookDto.Name,
                    ISBN13 = bookDto.ISBN13,
                    Editorial = bookDto.Editorial,
                    YearOfPubliction = bookDto.YearOfPubliction,
                    Format = (Format)bookDto.Format,
                    Genrre = (Genrre)bookDto.Genrre,
                    Language = bookDto.Language,
                    cover = bookDto.Cover,
                    Edition = bookDto.Edition,
                    Summary = bookDto.Summary,
                    Deleted = bookDto.Deleted,
                    Long = bookDto.Long
                };

                bookEntities.Add(book);
            }
            else
            {
                unmappedBooks.Add($"Libro: {bookDto.Name} (AuthorId: {bookDto.AuthorId})");
                _logger.LogWarning($"AuthorId {bookDto.AuthorId} no encontrado para el libro: {bookDto.Name}");
            }
        }

        foreach (var book in bookEntities)
        {
            await _unitOfWork.BookRepository.AddAsync(book);
        }

        await _unitOfWork.SaveAsync();
        
        _logger.LogInformation($"Seeding de libros completado. {bookEntities.Count} libros agregados.");
        
        if (unmappedBooks.Any())
        {
            _logger.LogWarning($"Libros sin mapeo de autor: {string.Join(", ", unmappedBooks)}");
        }

        if (validationErrors.Any())
        {
            _logger.LogWarning($"Errores de validación en mapeo: {string.Join(", ", validationErrors)}");
        }
    }
} 