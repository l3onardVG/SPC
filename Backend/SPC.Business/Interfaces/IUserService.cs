using SPC.Business.Dtos;
using SPC.Data.Models;
namespace SPC.Business.Interfaces;

public interface IUserService
{
    Task<bool> RegisterAdmin(RegisterModel userModel);
    Task<bool> RegisterUser(RegisterModel userModel);
    Task<TokenResponse> Login(LoginModel loginModel);
    Task SeedAdmin();
    Task<BaseMessage<UserDetail>> GetList();
    //Task<BaseMessage<User>> AddUser(User user);
    Task<BaseMessage<UserDetail>> FindById(string id);
    Task<BaseMessage<ApplicationUser>> UpdateUser(ApplicationUser user);
    Task<BaseMessage<ApplicationUser>> DeleteUser(ApplicationUser user);
    Task<BaseMessage<ApplicationUser>> DeleteUserId(string id);

}