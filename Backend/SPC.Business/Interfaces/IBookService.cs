using SPC.Business.Dtos;
using SPC.Data.Models;
using Microsoft.AspNetCore.Http;
namespace SPC.Business.Interfaces;

public interface IBookService
{
    Task<BaseMessage<Book>> GetList();
    Task<BaseMessage<Book>> AddBook(Book book);
    Task<BaseMessage<Book>> FindById(int id);
    Task<BaseMessage<BookDetailDto>> GetBookDetail(int id, string currentUserId);
    Task<BaseMessage<Book>> UpdateBook(Book book);
    Task<BaseMessage<Book>> DeleteBook(Book book);
    Task<BaseMessage<Book>> DeleteBookId(int id);
    Task<IEnumerable<Book>> SearchBooksAsync(BookSearchDto searchDto);
    Task<BaseMessage<Book>> UploadBookImage(int bookId, IFormFile file);
    Task<BaseMessage<Book>> AddBooks(List<Book> books);

    #region Learning to Test
    Task<string> TestBookCreation(Book book);
    #endregion

}