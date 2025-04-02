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

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<NikolaContext>()
    .AddDefaultTokenProviders();

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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]))

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

app.UseHttpsRedirection();
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
    }

}
#endregion

