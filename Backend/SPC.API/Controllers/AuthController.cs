using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SPC.Business.Dtos;
using SPC.Business.Interfaces;
using SPC.Data.Models;
using System.Net;

namespace SPC.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
    {
        try
        {
            var result = await _userService.LoginWithRefreshToken(loginModel);
            
            if (string.IsNullOrEmpty(result.AccessToken))
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        try
        {
            var result = await _userService.RefreshToken(request);
            
            if (string.IsNullOrEmpty(result.AccessToken))
            {
                return Unauthorized(new { message = "Invalid refresh token" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
        }
    }

    [HttpPost("revoke")]
    [Authorize]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequestDto request)
    {
        try
        {
            var result = await _userService.RevokeToken(request);
            
            if (!result)
            {
                return BadRequest(new { message = "Invalid refresh token" });
            }

            return Ok(new { message = "Token revoked successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
        }
    }

    [HttpPost("revoke-all")]
    [Authorize]
    public async Task<IActionResult> RevokeAllTokens([FromQuery] string userId)
    {
        try
        {
            var result = await _userService.RevokeAllUserTokens(userId);
            
            if (!result)
            {
                return BadRequest(new { message = "Failed to revoke tokens" });
            }

            return Ok(new { message = "All tokens revoked successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
    {
        try
        {
            var result = await _userService.RegisterUser(registerModel);
            
            if (!result)
            {
                return BadRequest(new { message = "Registration failed" });
            }

            return Ok(new { message = "User registered successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
        }
    }
} 