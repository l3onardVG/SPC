using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SPC.Business.Interfaces;
using SPC.Data.Models;
namespace SPC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [AdminOrReadOnly]
        [Route("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetList();
            return Ok(users);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("AddUser")]
        public async Task<IActionResult> AddUser(RegisterModel user)
        {
            var result = await _userService.RegisterUser(user);
            return Ok(result);
        }
        
        [HttpPost]
        [AdminOrReadOnly]
        [Route("AddAdmin")]
        public async Task<IActionResult> AddAdmin(RegisterModel user)
        {
            var result = await _userService.RegisterAdmin(user);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetUserById/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var result = await _userService.FindById(id);
            return Ok(result);
        }

        [HttpPut]
        [Route("UpdateUser")]
        public async Task<IActionResult> Update(ApplicationUser user)
        {
            var result = await _userService.UpdateUser(user);
            return Ok(result);
        }

        [HttpDelete]
        [Route("DeleteUser")]
        public async Task<IActionResult> DeleteUser(ApplicationUser user)
        {
            await _userService.DeleteUser(user);
            return Ok(user);
        }

        [HttpDelete]
        [Route("DeleteUserById/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _userService.DeleteUserId(id);
            if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPost]
        [AdminOrReadOnly]
        [Route("changeUserRole/{roleName}/{userId}")]
        public async Task<IActionResult> ChangeRole(string userId, string roleName)
        {
            var result = await _userService.UpdateUserRol(userId, roleName);
            return Ok(result);
        }
    }
}