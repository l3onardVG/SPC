using SPC.Data.Models;
namespace SPC.Business.Interfaces;

public interface IUserService
{
  Task<BaseMessage<User>> GetList();
  Task<BaseMessage<User>> AddUser(User user);
  Task<BaseMessage<User>> FindById(int id);
  Task<BaseMessage<User>> UpdateUser(User user);
  Task<BaseMessage<User>> DeleteUser(User user);
  Task<BaseMessage<User>> DeleteUserId(int id);

}