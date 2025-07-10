using System.Net;
using SPC.Business.Dtos;
using SPC.Business.Interfaces;
using SPC.Data;
using SPC.Data.Models;
using System.Text.RegularExpressions;


using Microsoft.AspNetCore.Http;
namespace SPC.Business.Services;

public class BookService : IBookService
{
    private readonly IUnitOfWork _unitOfWork;
    public BookService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseMessage<Book>> GetList()
    {
        var list = await _unitOfWork.BookRepository.GetAllAsync(includeProperties: "Author");
        return list.Any() ? BuildResponse(list.ToList(), "", HttpStatusCode.OK, list.Count()) : BuildResponse(list.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<Book>> AddBook(Book book)
    {
        var isValid = ValidateModel(book);
        if (!string.IsNullOrEmpty(isValid))
        {
            return BuildResponse(new(), isValid, HttpStatusCode.BadRequest);
        }
        try
        {
            await _unitOfWork.BookRepository.AddAsync(book);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Book>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<Book>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<Book> { book }
        };
    }

    public async Task<BaseMessage<Book>> FindById(int id)
    {
        Book? book = new();
        book = await _unitOfWork.BookRepository.FindAsync(id);

        return book != null ?
          BuildResponse(new List<Book>() { book }, "", HttpStatusCode.OK, 1) :
          BuildResponse(new List<Book>(), "Book Not Found", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<Book>> UpdateBook(Book book)
    {
        try
        {
            await _unitOfWork.BookRepository.Update(book);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Book>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<Book>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<Book> { book }
        };
    }

    public async Task<BaseMessage<Book>> DeleteBook(Book book)
    {
        try
        {
            await _unitOfWork.BookRepository.Delete(book);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Book>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<Book>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<Book> { book }
        };
    }

    public async Task<BaseMessage<Book>> DeleteBookId(int id)
    {
        Book? book = new();
        try
        {
            book = await _unitOfWork.BookRepository.FindAsync(id);
            if (book == null)
            {
                return new BaseMessage<Book>()
                {
                    Message = "Book Not Found",
                    StatusCode = HttpStatusCode.NotFound,
                    TotalElements = 0,
                    ResponseElements = new()
                };
            }
            await _unitOfWork.BookRepository.Delete(book);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Book>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<Book>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<Book> { book }
        };
    }

    public async Task<BaseMessage<Book>> UploadBookImage(int bookId, IFormFile file)
    {
        // Check if file is null or empty
        if (file == null || file.Length == 0)
        {
            return BuildResponse(new(), "No file was uploaded", HttpStatusCode.BadRequest);
        }

        // Validate file size (5MB max)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BuildResponse(new(), "File size exceeds 5MB limit", HttpStatusCode.BadRequest);
        }

        // Validate content type
        if (file.ContentType != "image/jpeg" && file.ContentType != "image/jpg" && file.ContentType != "image/png")
        {
            return BuildResponse(new(), "Only JPEG/JPG and PNG files are allowed", HttpStatusCode.BadRequest);
        }

        // Get the book
        var bookResponse = await FindById(bookId);
        if (bookResponse.StatusCode == HttpStatusCode.NotFound)
        {
            return BuildResponse(new(), "Book not found", HttpStatusCode.NotFound);
        }

        var book = bookResponse.ResponseElements.First();

        // Convert file to Base64
        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            byte[] imageBytes = memoryStream.ToArray();
            book.cover = Convert.ToBase64String(imageBytes);
        }

        // Update the book
        return await UpdateBook(book);
    }

     public async Task<BaseMessage<Book>> AddBooks(List<Book> books)
    {
        if (books == null || !books.Any())
        {
            return BuildResponse(new(), "The book list cannot be empty.", HttpStatusCode.BadRequest);
        }

        foreach (var book in books)
        {
            var isValid = ValidateModel(book);
            if (!string.IsNullOrEmpty(isValid))
            {
                return BuildResponse(new(), isValid, HttpStatusCode.BadRequest);
            }
        }

        try
        {
            foreach (var book in books)
            {
                await _unitOfWork.BookRepository.AddAsync(book);
            }
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Book>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }


        return new BaseMessage<Book>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = books.ToList()
        };

    }

    public async Task<BaseMessage<BookDetailDto>> GetBookDetail(int id, string currentUserId)
    {
        try
        {
            // Obtener el libro
            var book = await _unitOfWork.BookRepository.FindAsync(id);
            if (book == null)
            {
                return new BaseMessage<BookDetailDto>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Libro no encontrado"
                };
            }

            // Verificar si el usuario actual ya calificó este libro
            var userRating = await _unitOfWork.BookLogRepository.GetAllAsync(
                filter: x => x.BookId == id && 
                            x.UserId == currentUserId && 
                            x.Action == SPC.Data.Models.Action.Rate
            );

            // Mapear a DTO
            var bookDetail = new BookDetailDto
            {
                AuthorId = book.AuthorId,
                Name = book.Name,
                IsbN13 = book.ISBN13,
                Editorial = book.Editorial,
                YearOfPubliction = book.YearOfPubliction,
                Format = (int)book.Format,
                Genrre = (int)book.Genrre,
                Language = book.Language,
                Cover = book.cover,
                Edition = book.Edition,
                Summary = book.Summary,
                Deleted = book.Deleted,
                Long = book.Long,
                AverageRating = book.AverageRating,
                FilePath = book.FilePath,
                Author = book.Author,
                Id = book.Id,
                IsCurrentUserRated = userRating.Any()
            };

            return new BaseMessage<BookDetailDto>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Detalle del libro obtenido exitosamente",
                TotalElements = 1,
                ResponseElements = new List<BookDetailDto> { bookDetail }
            };
        }
        catch (Exception ex)
        {
            return new BaseMessage<BookDetailDto>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = $"Error al obtener el detalle del libro: {ex.Message}"
            };
        }
    }

    private BaseMessage<Book> BuildResponse(List<Book> lista, string message = "", HttpStatusCode status = HttpStatusCode.OK, int totalElements = 0)
    {
        return new BaseMessage<Book>()
        {
            Message = message,
            StatusCode = status,
            TotalElements = totalElements,
            ResponseElements = lista
        };
    }

    public async Task<IEnumerable<Book>> SearchBooksAsync(BookSearchDto searchDto)
    {
        return await _unitOfWork.BookRepository.GetAllAsync(
            filter: book =>
                (!searchDto.AuthorId.HasValue || book.AuthorId == searchDto.AuthorId) &&
                (string.IsNullOrEmpty(searchDto.AuthorName) ||
                    (book.Author.Name + " " + book.Author.Surname).Contains(searchDto.AuthorName)) &&
                (!searchDto.Genrre.HasValue || book.Genrre == searchDto.Genrre) &&
                (string.IsNullOrEmpty(searchDto.Language) || book.Language.Contains(searchDto.Language)) &&
                (!searchDto.Format.HasValue || book.Format == searchDto.Format) &&
                (!searchDto.YearOfPublication.HasValue || book.YearOfPubliction == searchDto.YearOfPublication) &&
                (string.IsNullOrEmpty(searchDto.Editorial) || book.Editorial.Contains(searchDto.Editorial)) &&
                (string.IsNullOrEmpty(searchDto.ISBN13) || book.ISBN13.Contains(searchDto.ISBN13)) &&
                (string.IsNullOrEmpty(searchDto.Name) || book.Name.Contains(searchDto.Name)) &&
                (!searchDto.IsAuthorAlive.HasValue || book.Author.IsAlive == searchDto.IsAuthorAlive) &&
                !book.Deleted,
            includeProperties: "Author"
        );
    }

    private string ValidateModel(Book book)
    {
        string message = string.Empty;

        if (string.IsNullOrEmpty(book.Name))
        {
            message += "El nombre es requerido";
        }
        if(string.IsNullOrEmpty(book.ISBN13))
        {
            message += "El ISBN13 es requerido";
        }
        if (!ISBNIsValid(book.ISBN13))
        {
            message += $"El ISBN debe tener un formato válido";
        }
        if (book.YearOfPubliction < 1450 || book.YearOfPubliction > DateTime.Now.Year)
        {
            message += "El año de publicación debe ser entre 1450 y 2025";
        }
        if (string.IsNullOrEmpty(book.Editorial))
        {
            message += "La editorial es requerida";
        }

        return message;

    }

    static bool ISBNIsValid(string input)
    {
        return Regex.IsMatch(input, @"^978-\d{1,5}-\d{1,7}-?\d{0,7}-?\d?$");

    }

    #region Learning to Test
    public async Task<string> TestBookCreation(Book book)
    {
        return ValidateModel(book);
    }
    #endregion
}