using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SPC.Data;
using SPC.Business.Interfaces;
using SPC.Business.Services;
using SPC.Data.Models;
using System.Text;


using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using DotNetEnv;  // Import the package
using System.Security.Claims; // Added for ClaimTypes


var builder = WebApplication.CreateBuilder(args);
Env.Load("../.env");

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins,
        policy =>
        {
            policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")// Permitir el frontend
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Configuration["ConnectionStrings:NikolaDatabase"] = Env.GetString("NIKOLA_DATABASE");
builder.Configuration["JWT:SecretKey"] = Env.GetString("JWT_SECRET_KEY");
builder.Configuration["JWT:ValidAudience"] = Env.GetString("JWT_VALID_AUDIENCE");
builder.Configuration["JWT:ValidIssuer"] = Env.GetString("JWT_VALID_ISSUER");

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddScoped<IBookService, BookService>();



builder.Services.AddDbContext<NikolaContext>(
    opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("NikolaDatabase"))
);

// Inyección de dependecias
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IAuthorService, AuthorService>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IBookLogService, BookLogService>();
builder.Services.AddScoped<ISeedService, SeedService>();
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<NikolaContext>()
    .AddDefaultTokenProviders();

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

// Mapear los claims personalizados
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap["sub"] = ClaimTypes.NameIdentifier;
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap["email"] = ClaimTypes.Email;
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap["given_name"] = ClaimTypes.Name;
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap["family_name"] = ClaimTypes.Surname;
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap["role"] = ClaimTypes.Role;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"])),
        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = ClaimTypes.Role
    };
});
builder.Services.AddDbContext<NikolaContext>(
    opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("NikolaDatabase"))
);

var app = builder.Build();
PopulateDB(app);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(MyAllowSpecificOrigins); 

app.UseAuthentication();
app.UseAuthorization();

// HTTPS redirection eliminado para Docker
app.MapControllers();
app.Run();



#region PopulateDB
async void PopulateDB(WebApplication app)
{
    using (var scope = app.Services.CreateScope())
    {
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        if (!userManager.Users.Any())
        {
            var seedMain = scope.ServiceProvider.GetRequiredService<IUserService>();
            await seedMain.SeedAdmin();
        }

        // Seed de datos desde JSON
        var seedService = scope.ServiceProvider.GetRequiredService<ISeedService>();
        await seedService.SeedDataFromJsonAsync();
    }

}
#endregion

