using SPC.Data.Models;
namespace SPC.Data;

public interface IUnitOfWork
{
    IRepository<int, Author> AuthorRepository{get;}
    Task SaveAsync();
}