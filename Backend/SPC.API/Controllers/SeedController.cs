using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SPC.Business.Interfaces;
using SPC.Business.Services;

namespace SPC.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class SeedController : ControllerBase
{
    private readonly ISeedService _seedService;
    private readonly ILogger<SeedController> _logger;

    public SeedController(ISeedService seedService, ILogger<SeedController> logger)
    {
        _seedService = seedService;
        _logger = logger;
    }

    [HttpPost("all")]
    public async Task<IActionResult> SeedAllData()
    {
        try
        {
            _logger.LogInformation("Iniciando seeding manual de todos los datos...");
            await _seedService.SeedDataFromJsonAsync();
            return Ok(new { message = "Seeding completado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el seeding manual");
            return StatusCode(500, new { error = "Error durante el seeding", details = ex.Message });
        }
    }

    [HttpPost("authors")]
    public async Task<IActionResult> SeedAuthors()
    {
        try
        {
            _logger.LogInformation("Iniciando seeding manual de autores...");
            await _seedService.SeedAuthorsAsync();
            return Ok(new { message = "Seeding de autores completado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el seeding de autores");
            return StatusCode(500, new { error = "Error durante el seeding de autores", details = ex.Message });
        }
    }

    [HttpPost("books")]
    public async Task<IActionResult> SeedBooks()
    {
        try
        {
            _logger.LogInformation("Iniciando seeding manual de libros...");
            await _seedService.SeedBooksAsync();
            return Ok(new { message = "Seeding de libros completado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el seeding de libros");
            return StatusCode(500, new { error = "Error durante el seeding de libros", details = ex.Message });
        }
    }
} 