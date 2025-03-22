using System.Net;
using SPC.Business.Interfaces;
using SPC.Data;
using SPC.Data.Models;
namespace SPC.Business.Services;

public class UserService : IUserService
{
  private readonly IUnitOfWork _unitOfWork;
  public UserService(IUnitOfWork unitOfWork)
  {
    _unitOfWork = unitOfWork;
  }

  public async Task<BaseMessage<User>> GetList()
  {
    var list = await _unitOfWork.UserRepository.GetAllAsync();
    return list.Any() ? BuildResponse(list.ToList(), "", HttpStatusCode.OK, list.Count()) : BuildResponse(list.ToList(), "", HttpStatusCode.NotFound, 0);
  }

  public async Task<BaseMessage<User>> AddUser(User user)
  {
    try{
      await _unitOfWork.UserRepository.AddAsync(user);
      await _unitOfWork.SaveAsync();
    }
    catch(Exception ex)
    {
      return new BaseMessage<User>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new ()
      };
    }

    return new BaseMessage<User>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<User>{user}
    };
  }

   public async Task<BaseMessage<User>> FindById(int id)
    {
        User? user = new();
        user = await _unitOfWork.UserRepository.FindAsync(id);

        return user != null ?
            BuildResponse(new List<User>(){user}, "", HttpStatusCode.OK, 1) :
            BuildResponse(new List<User>(), "", HttpStatusCode.NotFound, 0);
    }
  
  public async Task<BaseMessage<User>> UpdateUser(User user)
  {
    try{
      await _unitOfWork.UserRepository.Update(user);
      await _unitOfWork.SaveAsync();
    }
    catch (Exception ex)
    {
      return new BaseMessage<User>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new ()
      };
    }

    return new BaseMessage<User>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<User>{user}
    };
  }
  
  public async Task<BaseMessage<User>> DeleteUser(User user)
  {
    try{
      await _unitOfWork.UserRepository.Delete(user);
      await _unitOfWork.SaveAsync();
    }
    catch (Exception ex)
    {
      return new BaseMessage<User>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new ()
      };
    }

    return new BaseMessage<User>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<User>{user}
    };
  }

  public async Task<BaseMessage<User>> DeleteUserId(int id)
  {
    User? user = new();
    try{
      user = await _unitOfWork.UserRepository.FindAsync(id);
      await _unitOfWork.UserRepository.Delete(id);
      await _unitOfWork.SaveAsync();
    }
    catch (Exception ex)
    {
      return new BaseMessage<User>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new ()
      };
    }

    return new BaseMessage<User>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<User>{user}
    };
  }

  private BaseMessage<User> BuildResponse(List<User> lista, string message = "", HttpStatusCode status = HttpStatusCode.OK,
        int totalElements = 0)
    {
        return new BaseMessage<User>(){
            Message = message,
            StatusCode = status,
            TotalElements = totalElements,
            ResponseElements = lista
        };
    }
}