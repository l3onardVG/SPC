using System.Net;
using SPC.Business.Interfaces;
using SPC.Data;
using SPC.Data.Models;
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
    if(!string.IsNullOrEmpty(isValid))
    {
      return BuildResponse(new(), isValid, HttpStatusCode.BadRequest);
    }
    try{
      await _unitOfWork.BookRepository.AddAsync(book);
      await _unitOfWork.SaveAsync();
    }
    catch(Exception ex)
    {
      return new BaseMessage<Book>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new ()
      };
    }

    return new BaseMessage<Book>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<Book>{book}
    };
  }

  public async Task<BaseMessage<Book>> FindById(int id)
  {
    Book? book = new();
    book = await _unitOfWork.BookRepository.FindAsync(id);

    return book != null ? 
      BuildResponse(new List<Book>(){book}, "", HttpStatusCode.OK, 1) :
      BuildResponse(new List<Book>(), "", HttpStatusCode.NotFound, 0);
  }

  public async Task<BaseMessage<Book>> UpdateBook(Book book)
  {
    try{
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
        ResponseElements = new ()
      };
    }

    return new BaseMessage<Book>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<Book>{book}
    };
  }

  public async Task<BaseMessage<Book>> DeleteBook(Book book)
  {
    try{
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
        ResponseElements = new ()
      };
    }

    return new BaseMessage<Book>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<Book>{book}
    };
  }

 public async Task<BaseMessage<Book>> DeleteBookId(int id)
  {
    Book? book = new();
    try{
      book = await _unitOfWork.BookRepository.FindAsync(id);
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
        ResponseElements = new ()
      };
    }

    return new BaseMessage<Book>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<Book>{book}
    };
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

  private string ValidateModel(Book book)
  {
    string message = string.Empty;

    if(string.IsNullOrEmpty(book.Name))
    {
      message += "El nombre es requerido";
    }
    if(book.YearOfPubliction < 1450 || book.YearOfPubliction > DateTime.Now.Year)
    {
      message += "El año de publicación debe ser entre 1450 y 2025";
    }
    if(string.IsNullOrEmpty(book.Editorial))
    {
      message += "La editorial es requerida";
    }

    return message;
  }

  #region Learning to Test
  public async Task<string> TestBookCreation(Book book)
  {
    return ValidateModel(book);
  }
  #endregion


}