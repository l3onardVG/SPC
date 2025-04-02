using SPC.Data.Models;
namespace SPC.Data;

public interface IUnitOfWork
{
    IRepository<int, Author> AuthorRepository { get; }
    IRepository<int, Book> BookRepository { get; }
    IRepository<int, BookLog> BookLogRepository { get; }
    Task SaveAsync();
}