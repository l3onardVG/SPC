using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SPC.Business.Interfaces;
using SPC.Data.Models;
using System.Net;


public class UserService : IUserService
{
  private readonly UserManager<ApplicationUser> _userManager;
  private readonly RoleManager<IdentityRole> _roleManager;
  private IConfiguration _configuration;
  public UserService(
      UserManager<ApplicationUser> userManager, 
      RoleManager<IdentityRole> roleManager,
      IConfiguration configuration
  )
  {
      _userManager = userManager;
      _roleManager = roleManager;
      _configuration = configuration;
  }

  public async Task<TokenResponse> Login(LoginModel loginModel)
  {
      var user = await _userManager.FindByNameAsync(loginModel.UserName) ;
      if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
      {
          var userRoles = await _userManager.GetRolesAsync(user);
          var authClaims = new List<Claim>
          {
              new Claim(ClaimTypes.Name, user.UserName),
              new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
          };

          foreach(var userRole in userRoles)
          {
              authClaims.Add(new Claim(ClaimTypes.Role, userRole));
          }

          var authSignkey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
          var token = new JwtSecurityToken(
              issuer: _configuration["JWT:ValidIssuer"],
              audience: _configuration["JWT:ValidAudience"],
              expires: DateTime.UtcNow.AddDays(7),
              claims: authClaims,
              signingCredentials: new SigningCredentials(authSignkey, SecurityAlgorithms.HmacSha256)
          );
          return new TokenResponse(){
              Token = new JwtSecurityTokenHandler().WriteToken(token),
              Expiration = token.ValidTo,
              UserName = user.UserName
          };
      }
      return new TokenResponse();
  }

  public async Task<BaseMessage<ApplicationUser>> GetList()
  {
    var users = await  _userManager.Users.ToListAsync();
    //var list = await _unitOfWork.UserRepository.GetAllAsync();
    return users.Any() ? BuildResponse(users, "", HttpStatusCode.OK, users.Count) : BuildResponse(users, "", HttpStatusCode.NotFound, 0);
  }

   public async Task<BaseMessage<ApplicationUser>> FindById(string id)
    {
        ApplicationUser? user = new();
        //user = await _unitOfWork.UserRepository.FindAsync(id);
        user = await _userManager.FindByIdAsync(id);

        return user != null ?
            BuildResponse(new List<ApplicationUser>(){user}, "", HttpStatusCode.OK, 1) :
            BuildResponse(new List<ApplicationUser>(), "", HttpStatusCode.NotFound, 0);
    }
  
  public async Task<BaseMessage<ApplicationUser>> UpdateUser(ApplicationUser user)
  {
    try{
      await _userManager.UpdateAsync(user);
      //await _unitOfWork.UserRepository.Update(user);
      //await _unitOfWork.SaveAsync();
    }
    catch (Exception ex)
    {
      return new BaseMessage<ApplicationUser>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new ()
      };
    }

    return new BaseMessage<ApplicationUser>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<ApplicationUser>{user}
    };
  }
  
  public async Task<BaseMessage<ApplicationUser>> DeleteUser(ApplicationUser user)
  {
    try{
      await _userManager.DeleteAsync(user);
      //await _unitOfWork.UserRepository.Delete(user);
      //await _unitOfWork.SaveAsync();
    }
    catch (Exception ex)
    {
      return new BaseMessage<ApplicationUser>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new ()
      };
    }

    return new BaseMessage<ApplicationUser>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<ApplicationUser>{user}
    };
  }

  public async Task<BaseMessage<ApplicationUser>> DeleteUserId(string id)
  {
    ApplicationUser? user = new();
    try{
      //user = await _unitOfWork.UserRepository.FindAsync(id);
      user = await _userManager.FindByIdAsync(id);
      await _userManager.DeleteAsync(user);
      //await _userManager.UserRepository.Delete(id);
      //await _unitOfWork.SaveAsync();
    }
    catch (Exception ex)
    {
      return new BaseMessage<ApplicationUser>()
      {
        Message = $"[Exception]: {ex.Message}",
        StatusCode = HttpStatusCode.InternalServerError,
        TotalElements = 0,
        ResponseElements = new ()
      };
    }

    return new BaseMessage<ApplicationUser>()
    {
      Message = "",
      StatusCode = HttpStatusCode.OK,
      TotalElements = 1,
      ResponseElements = new List<ApplicationUser>{user}
    };
  }

  private BaseMessage<ApplicationUser> BuildResponse(List<ApplicationUser> lista, string message = "", HttpStatusCode status = HttpStatusCode.OK,
        int totalElements = 0)
    {
        return new BaseMessage<ApplicationUser>(){
            Message = message,
            StatusCode = status,
            TotalElements = totalElements,
            ResponseElements = lista
        };
    }

public async Task<bool> RegisterAdmin(RegisterModel userModel)
    {
        var userExist = await _userManager.FindByNameAsync(userModel.UserName);
        if (userExist != null)
        {
            return false;
        }

        ApplicationUser user = new ApplicationUser()
        {
            Email = userModel.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = userModel.UserName,
        };
        var result = await _userManager.CreateAsync(user, userModel.Password);
        if (!result.Succeeded)
        {
            return false;
        }
        if(!await _roleManager.RoleExistsAsync(UserRoles.Admin))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
        }
        if(!await _roleManager.RoleExistsAsync(UserRoles.Users))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Users));
        }
        if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
        {
            await _userManager.AddToRoleAsync(user,UserRoles.Admin);
        }
        return true;
    }

    public Task<bool> RegisterUser(RegisterModel userModel)
    {
        throw new NotImplementedException();
    }

    public async Task SeedAdmin()
    {
        await RegisterAdmin(new RegisterModel(){
            Email = "admin@eafit.edu.co",
            Password = "fdkreeArd24%",
            UserName = "admin"
        });
    }
}