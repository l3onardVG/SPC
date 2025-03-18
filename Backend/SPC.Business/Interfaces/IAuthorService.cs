using SPC.Data.Models;
namespace SPC.Business.Interfaces;
public interface IAuthorService
{
    Task<BaseMessage<Author>> GetList();
    Task<BaseMessage<Author>> AddAuthor(Author author);
    Task<BaseMessage<Author>> FindById(int id);
    Task<BaseMessage<Author>> FindByName(string name);
    Task<BaseMessage<Author>> FindByProperties(string name, int year);

}