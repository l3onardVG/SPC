using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SPC.Business.Interfaces;
using SPC.Business.Dtos;
using SPC.Data.Models;
namespace SPC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class BookLogController : ControllerBase
    {
        private readonly IBookLogService _bookLogService;

        public BookLogController(IBookLogService bookLogService)
        {
            _bookLogService = bookLogService;
        }

        [HttpGet]
        [Route("GetAllBookLogs")]
        public async Task<IActionResult> GetAllBookLog()
        {
            var bookLogs = await _bookLogService.GetList();
            return Ok(bookLogs);
        }

        [HttpPost]
        [Route("AddBookLog")]
        public async Task<IActionResult> AddBookLog(BookLog bookLog)
        {
            var result = await _bookLogService.AddBookLog(bookLog);
            return Ok(result);
        }

        [HttpPost]
        [Route("RateBook/{bookId}")]
        public async Task<IActionResult> RateBook(int bookId, [FromBody] BookRatingDto ratingDto)
        {
            // Obtener el ID del usuario autenticado
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "Usuario no autenticado" });
            }

            var result = await _bookLogService.RateBook(bookId, userId, ratingDto);
            
            if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            
            if (result.StatusCode == HttpStatusCode.BadRequest)
            {
                return BadRequest(result);
            }
            
            return Ok(result);
        }

        [HttpGet]
        [Route("GetBookLogById/{id}")]
        public async Task<IActionResult> GetBookLogById(int id)
        {
            var result = await _bookLogService.FindById(id);
            if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPut]
        [Route("UpdateBookLog")]
        public async Task<IActionResult> Update(BookLog bookLog)
        {
            var result = await _bookLogService.UpdateBookLog(bookLog);
            return Ok(result);
        }

        [HttpDelete]
        [Route("DeleteBookLog")]
        public async Task<IActionResult> DeleteBookLog(BookLog bookLog)
        {
            await _bookLogService.DeleteBookLog(bookLog);
            return Ok(bookLog);
        }

    [HttpDelete]
    [Route("DeleteBookLogById/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _bookLogService.DeleteBookLogId(id);
        if (result.StatusCode == HttpStatusCode.NotFound)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    [HttpGet("ratings/{bookId}")]
    public async Task<IActionResult> GetRatings(int bookId)
    {
        var ratings = await _bookLogService.GetRatingsForBook(bookId);
        return Ok(ratings);
    }

    [HttpGet("reviews/{bookId}")]
    public async Task<IActionResult> GetBookReviews(int bookId)
    {
        // Obtener el ID del usuario autenticado
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Message = "Usuario no autenticado" });
        }

        var reviews = await _bookLogService.GetBookReviews(bookId, userId);
        
        if (reviews.StatusCode == HttpStatusCode.NotFound)
        {
            return NotFound(reviews);
        }
        
        return Ok(reviews);
    }
  }
}