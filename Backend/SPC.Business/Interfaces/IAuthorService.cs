using SPC.Data.Models;
namespace SPC.Business.Interfaces;
public interface IAuthorService
{
    Task<BaseMessage<Author>> GetList();
    Task<BaseMessage<Author>> AddAuthor(Author author);
    Task<BaseMessage<Author>> FindById(int id);
    Task<BaseMessage<Author>> FindByName(string name);
    Task<BaseMessage<Author>> FindByProperties(string name, int year);
    Task<BaseMessage<Author>> UpdateAuthor(Author author);
    Task<BaseMessage<Author>> DeleteAuthor(Author author);
    Task<BaseMessage<Author>> DeleteAuthorId(int id);

    #region Learning to Test
    Task<string> TestAuthorCreation(Author author);
    #endregion
}