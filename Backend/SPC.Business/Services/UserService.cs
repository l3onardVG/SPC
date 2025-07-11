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
using SPC.Business.Dtos;
using SPC.Data;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly NikolaContext _context;

    public UserService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        NikolaContext context
    )
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _context = context;
    }

// To be removed
    public async Task<TokenResponse> Login(LoginModel loginModel)
    {
        var user = await _userManager.FindByEmailAsync(loginModel.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
        {
            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
          {
              new Claim(ClaimTypes.NameIdentifier, user.Id),
              new Claim(ClaimTypes.Email, user.Email),
              new Claim(ClaimTypes.Name,user.Name),
              new Claim(ClaimTypes.Surname, user.Surname),
              new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
          };

            foreach (var userRole in userRoles)
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
            return new TokenResponse()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo,
                Email = user.Email
            };
        }
        return new TokenResponse();
    }

    public async Task<BaseMessage<UserDetail>> GetList()
    {
        var users = await _userManager.Users.ToListAsync();

        List<UserDetail> userResponse = users.Select(user => new UserDetail
        {
            Name = user.Name,
            Surname = user.Surname,
            Email = user.Email,
            DocumentType = user.DocumentType,
            DocumentNumber = user.DocumentNumber,
            TermsAceptance = user.TermsAceptance,
            UserType = user.UserType,
            Id = user.Id,

        }).ToList();
        //var list = await _unitOfWork.UserRepository.GetAllAsync();
        return userResponse.Any() ? BuildResponse(userResponse, "", HttpStatusCode.OK, users.Count) : BuildResponse(userResponse, "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<UserDetail>> FindById(string id)
    {
        ApplicationUser? user = new();
        //user = await _unitOfWork.UserRepository.FindAsync(id);
        user = await _userManager.FindByIdAsync(id);

        UserDetail userDetail = new UserDetail
        {
            Name = user.Name,
            Surname = user.Surname,
            Email = user.Email,
            DocumentType = user.DocumentType,
            DocumentNumber = user.DocumentNumber,
            TermsAceptance = user.TermsAceptance,
            UserType = user.UserType,
            Id = user.Id,
        };

        return user != null ?
            BuildResponse(new List<UserDetail>() { userDetail }, "", HttpStatusCode.OK, 1) :
            BuildResponse(new List<UserDetail>(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<ApplicationUser>> UpdateUser(ApplicationUser user)
    {
        var userExist = await _userManager.FindByEmailAsync(user.Email);
        if (userExist == null)
        {
            return new BaseMessage<ApplicationUser>()
            {
                Message = "Usuario no encontrado.",
                StatusCode = HttpStatusCode.NotFound,
                TotalElements = 0,
                ResponseElements = new()
            };
        }
        try
        {
            userExist.Name = user.Name;
            userExist.Surname = user.Surname;
            userExist.Email = user.Email;
            userExist.DocumentType = user.DocumentType;
            userExist.DocumentNumber = user.DocumentNumber;
            userExist.UserType = user.UserType;

            var result = await _userManager.UpdateAsync(userExist);
            if (!result.Succeeded)
            {
                return new BaseMessage<ApplicationUser>()
                {
                    Message = $"Error al actualizar usuario: {string.Join(", ", result.Errors.Select(e => e.Description))}",
                    StatusCode = HttpStatusCode.BadRequest,
                    TotalElements = 0,
                    ResponseElements = new()
                };
            }
        }
        catch (Exception ex)
        {
            return new BaseMessage<ApplicationUser>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<ApplicationUser>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<ApplicationUser> { userExist }
        };
    }

    public async Task<BaseMessage<ApplicationUser>> DeleteUser(ApplicationUser user)
    {
        var userExist = await _userManager.FindByEmailAsync(user.Email);
        if (userExist == null)
        {
            return new BaseMessage<ApplicationUser>()
            {
                Message = "Usuario no encontrado.",
                StatusCode = HttpStatusCode.NotFound,
                TotalElements = 0,
                ResponseElements = new()
            };
        }
        try
        {
            await _userManager.DeleteAsync(userExist);
        }
        catch (Exception ex)
        {
            return new BaseMessage<ApplicationUser>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<ApplicationUser>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<ApplicationUser> { user }
        };
    }

    public async Task<BaseMessage<ApplicationUser>> DeleteUserId(string id)
    {
        ApplicationUser? user = new();
        try
        {
            user = await _userManager.FindByIdAsync(id);
            if(user == null){
                return new BaseMessage<ApplicationUser>()
                {
                    Message = "Usuario no encontrado.",
                    StatusCode = HttpStatusCode.NotFound,
                    TotalElements = 0,
                    ResponseElements = new()
                };
            }
            await _userManager.DeleteAsync(user);
        }
        catch (Exception ex)
        {
            return new BaseMessage<ApplicationUser>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<ApplicationUser>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<ApplicationUser> { user }
        };
    }

    private BaseMessage<T> BuildResponse<T>(List<T> lista, string message = "", HttpStatusCode status = HttpStatusCode.OK, int totalElements = 0)
    where T : class
    {
        return new BaseMessage<T>()
        {
            Message = message,
            StatusCode = status,
            TotalElements = totalElements,
            ResponseElements = lista
        };
    }

    public async Task<bool> RegisterAdmin(RegisterModel userModel)
    {
        var userExist = await _userManager.FindByEmailAsync(userModel.Email);
        if (userExist != null)
        {
            return false;
        }

        ApplicationUser user = new ApplicationUser()
        {
            Email = userModel.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = userModel.Email.Split('@')[0],
            Name = userModel.Name,
            Surname = userModel.Surname,
            DocumentType = userModel.DocumentType,
            DocumentNumber = userModel.DocumentNumber,
            UserType = userModel.UserType,
            TermsAceptance = userModel.TermsAceptance,
        };
        var result = await _userManager.CreateAsync(user, userModel.Password);
        if (!result.Succeeded)
        {
            return false;
        }
        if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
        }
        if (!await _roleManager.RoleExistsAsync(UserRoles.Users))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Users));
        }
        if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
        {
            await _userManager.AddToRoleAsync(user, UserRoles.Admin);
        }
        return true;
    }

    public async Task<bool> RegisterUser(RegisterModel userModel)
    {
        var userExist = await _userManager.FindByEmailAsync(userModel.Email);
        if (userExist != null)
        {
            return false;
        }

        ApplicationUser user = new ApplicationUser()
        {
            Email = userModel.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = userModel.Email.Split('@')[0],
            Name = userModel.Name,
            Surname = userModel.Surname,
            DocumentType = userModel.DocumentType,
            DocumentNumber = userModel.DocumentNumber,
            UserType = userModel.UserType,
            TermsAceptance = userModel.TermsAceptance,
        };
        var result = await _userManager.CreateAsync(user, userModel.Password);
        if (!result.Succeeded)
        {
        Console.WriteLine("Error al crear el usuario:");
        foreach (var error in result.Errors)
        {
            Console.WriteLine($"{error.Description}");
        }
        return false;
    }
        if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
        }
        if (!await _roleManager.RoleExistsAsync(UserRoles.Users))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Users));
        }
        if (await _roleManager.RoleExistsAsync(UserRoles.Users))
        {
            await _userManager.AddToRoleAsync(user, UserRoles.Users);
        }
        return true;
    }

    public async Task<bool> UpdateUserRol(string userId, string roleName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        var currentRoles = await _userManager.GetRolesAsync(user);
        if (currentRoles.Any())
        {
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
        }

        if (!await _userManager.IsInRoleAsync(user, roleName))
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }

            var result = await _userManager.AddToRoleAsync(user, roleName);
            return result.Succeeded;
        }
        return true;
    }

    public async Task SeedAdmin()
    {
        await RegisterAdmin(new RegisterModel()
        {
            Email = "admin@eafit.edu.co",
            Password = "fdkreeArd24%",
            //UserName = "admin"
            Name = "Mark",
            Surname = "Twain",
            DocumentType = "CC",
            DocumentNumber = "1234567890",
            UserType = "Admin",
            TermsAceptance = true
        });
    }

    public async Task<AuthResponseDto> LoginWithRefreshToken(LoginModel loginModel)
    {
        var user = await _userManager.FindByEmailAsync(loginModel.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
        {
            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Surname, user.Surname),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            // Generate access token
            var authSignkey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
            var accessTokenExpiry = DateTime.UtcNow.AddHours(1); // 1 hour
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: accessTokenExpiry,
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSignkey, SecurityAlgorithms.HmacSha256)
            );

            // Generate refresh token
            var refreshToken = GenerateRefreshToken();
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            // Save refresh token to database
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiryDate = refreshTokenExpiry,
                CreatedAt = DateTime.UtcNow
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = refreshToken,
                AccessTokenExpiry = accessTokenExpiry,
                RefreshTokenExpiry = refreshTokenExpiry,
                UserId = user.Id,
                UserName = user.Name,
                UserEmail = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Roles = userRoles.ToList()
            };
        }

        return new AuthResponseDto();
    }

    public async Task<AuthResponseDto> RefreshToken(RefreshTokenRequestDto request)
    {
        try
        {
            // Validate the expired access token to get user info
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]);

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["JWT:ValidIssuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["JWT:ValidAudience"],
                ValidateLifetime = false // We want to accept expired tokens
            };

            var principal = tokenHandler.ValidateToken(request.AccessToken, tokenValidationParameters, out var validatedToken);

            // Get user from database
            var userEmail = principal.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(userEmail);

            if (user == null)
            {
                return new AuthResponseDto();
            }

            // Validate refresh token
            var refreshToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken && rt.UserId == user.Id);

            if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpiryDate < DateTime.UtcNow)
            {
                return new AuthResponseDto();
            }

            // Generate new access token
            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Surname, user.Surname),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var authSignkey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
            var accessTokenExpiry = DateTime.UtcNow.AddHours(1);
            var newToken = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: accessTokenExpiry,
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSignkey, SecurityAlgorithms.HmacSha256)
            );

            // Revoke old refresh token and generate new one
            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;

            var newRefreshToken = GenerateRefreshToken();
            var newRefreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                UserId = user.Id,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow
            };

            _context.RefreshTokens.Add(newRefreshTokenEntity);
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(newToken),
                RefreshToken = newRefreshToken,
                AccessTokenExpiry = accessTokenExpiry,
                RefreshTokenExpiry = newRefreshTokenEntity.ExpiryDate,
                UserId = user.Id,
                UserName = user.Name,
                UserEmail = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Roles = userRoles.ToList()
            };
        }
        catch (Exception)
        {
            return new AuthResponseDto();
        }
    }

    public async Task<bool> RevokeToken(RevokeTokenRequestDto request)
    {
        try
        {
            var refreshToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (refreshToken == null)
            {
                return false;
            }

            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> RevokeAllUserTokens(string userId)
    {
        try
        {
            var refreshTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                .ToListAsync();

            foreach (var token in refreshTokens)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private string GenerateRefreshToken()
    {
        return Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(64));
    }
}