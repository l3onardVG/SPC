using System.Net;
using Microsoft.AspNetCore.Identity;
using SPC.Business.Interfaces;
using SPC.Business.Dtos;
using SPC.Data;
using SPC.Data.Models;
namespace SPC.Business.Services;

public class BookLogService : IBookLogService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<ApplicationUser> _userManager;

    public BookLogService(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    public async Task<BaseMessage<BookLog>> GetList()
    {
        var list = await _unitOfWork.BookLogRepository.GetAllAsync(includeProperties: "User,Book");
        return list.Any() ? BuildResponse(list.ToList(), "", HttpStatusCode.OK, list.Count()) : BuildResponse(list.ToList(), "", HttpStatusCode.NotFound, 0);
    }

  public async Task<BaseMessage<BookLog>> AddBookLog(BookLog bookLog)
  {
    try {
      if(bookLog.Action == SPC.Data.Models.Action.Rate)
      {
        if(bookLog.Rating is null || bookLog.Rating < 1 || bookLog.Rating > 5){
          return new BaseMessage<BookLog>()
            {
              Message = "La calificación debe estar entre 1 y 5.",
              StatusCode = HttpStatusCode.BadRequest,
              TotalElements = 0,
              ResponseElements = new()
            };
        }

      }
      await _unitOfWork.BookLogRepository.AddAsync(bookLog);
      await _unitOfWork.SaveAsync();

      if(bookLog.Action == SPC.Data.Models.Action.Rate){
        await UpdateBookRating(bookLog.BookId);
      }
    }
    catch (Exception ex)
    {
      return new BaseMessage<BookLog>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new ()
      };
    }

        return new BaseMessage<BookLog>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<BookLog> { bookLog }
        };
    }

    public async Task<BaseMessage<BookLog>> RateBook(int bookId, string userId, BookRatingDto ratingDto)
    {
        try
        {
            // Verificar que el libro existe
            var book = await _unitOfWork.BookRepository.FindAsync(bookId);
            if (book == null)
            {
                return new BaseMessage<BookLog>()
                {
                    Message = "El libro no existe.",
                    StatusCode = HttpStatusCode.NotFound,
                    TotalElements = 0,
                    ResponseElements = new()
                };
            }

            // Verificar que el usuario existe usando UserManager
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new BaseMessage<BookLog>()
                {
                    Message = "El usuario no existe.",
                    StatusCode = HttpStatusCode.NotFound,
                    TotalElements = 0,
                    ResponseElements = new()
                };
            }

            // Verificar si el usuario ya calificó este libro
            var existingRating = await _unitOfWork.BookLogRepository.GetAllAsync(
                filter: x => x.BookId == bookId && 
                            x.UserId == userId && 
                            x.Action == SPC.Data.Models.Action.Rate
            );

            if (existingRating.Any())
            {
                return new BaseMessage<BookLog>()
                {
                    Message = "Ya has calificado este libro anteriormente.",
                    StatusCode = HttpStatusCode.BadRequest,
                    TotalElements = 0,
                    ResponseElements = new()
                };
            }

            // Crear el BookLog para la calificación
            var bookLog = new BookLog
            {
                Action = SPC.Data.Models.Action.Rate,
                UserId = userId,
                BookId = bookId,
                Timestamp = DateTime.UtcNow,
                Rating = ratingDto.Rating,
                Comment = ratingDto.Comment
            };

            // Guardar la calificación
            await _unitOfWork.BookLogRepository.AddAsync(bookLog);
            await _unitOfWork.SaveAsync();

            // Actualizar el rating promedio del libro
            await UpdateBookRating(bookId);

            return new BaseMessage<BookLog>()
            {
                Message = "Libro calificado exitosamente.",
                StatusCode = HttpStatusCode.OK,
                TotalElements = 1,
                ResponseElements = new List<BookLog> { bookLog }
            };
        }
        catch (Exception ex)
        {
            return new BaseMessage<BookLog>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }
    }

    public async Task<BaseMessage<BookLog>> FindById(int id)
    {
        BookLog? bookLog = new();
        bookLog = await _unitOfWork.BookLogRepository.FindAsync(id);

        return bookLog != null ?
          BuildResponse(new List<BookLog>() { bookLog }, "", HttpStatusCode.OK, 1) : BuildResponse(new List<BookLog>(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<BookLog>> UpdateBookLog(BookLog bookLog)
    {
        try
        {
            await _unitOfWork.BookLogRepository.Update(bookLog);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<BookLog>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<BookLog>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<BookLog> { bookLog }
        };
    }

    public async Task<BaseMessage<BookLog>> DeleteBookLog(BookLog bookLog)
    {
        try
        {
            await _unitOfWork.BookLogRepository.Delete(bookLog);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<BookLog>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<BookLog>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<BookLog> { bookLog }
        };
    }

    public async Task<BaseMessage<BookLog>> DeleteBookLogId(int id)
    {
        BookLog? bookLog = new();
        try
        {
            bookLog = await _unitOfWork.BookLogRepository.FindAsync(id);
            if (bookLog == null)
            {
                return new BaseMessage<BookLog>()
                {
                    Message = "BookLog Not Found",
                    StatusCode = HttpStatusCode.NotFound,
                    TotalElements = 0,
                    ResponseElements = new()
                };
            }
            await _unitOfWork.BookLogRepository.Delete(id);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<BookLog>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

    return new BaseMessage<BookLog>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<BookLog>{bookLog}
    };
  }

  public async Task UpdateBookRating(int bookId)
  {
    var ratings = await _unitOfWork.BookLogRepository.GetAllAsync(filter: x => (x.BookId == bookId) && (x.Rating != null));

    var book = await _unitOfWork.BookRepository.FindAsync(bookId);
    if (book != null)
    {
      var ratingValues = ratings.Select(r => r.Rating.GetValueOrDefault()).ToList();
      book.AverageRating = ratingValues.Any() ? ratingValues.Average() : 0;
      await _unitOfWork.BookRepository.Update(book);
      await _unitOfWork.SaveAsync();
    }
  }

  public async Task<BaseMessage<BookLog>> GetRatingsForBook(int bookId)
  {
    try{
      var bookLogs = await _unitOfWork.BookLogRepository.GetAllAsync(includeProperties: "Book", filter: x => x.BookId == bookId && x.Rating != null);
      var ratings = await _unitOfWork.BookLogRepository.GetAllAsync(filter: x => (x.BookId == bookId) && (x.Rating != null));
       var ratingValues = ratings.Select(r => r.Rating.GetValueOrDefault()).ToList();
    
    var prom = ratingValues.Any() ? ratingValues.Average() : 0;
    
    return new BaseMessage<BookLog>()
      {
      Message = $"{prom}",
      StatusCode = HttpStatusCode.OK,
      TotalElements = bookLogs.Count(),
      ResponseElements = bookLogs.ToList(),
      };
    
    }catch(Exception ex)
    {
       return new BaseMessage<BookLog>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new()
      };
    }
  }

    private BaseMessage<BookLog> BuildResponse(List<BookLog> list, string message = "", HttpStatusCode status = HttpStatusCode.OK, int totalElements = 0)
    {
        return new BaseMessage<BookLog>()
        {
            Message = message,
            StatusCode = status,
            TotalElements = totalElements,
            ResponseElements = list
        };
    }
}