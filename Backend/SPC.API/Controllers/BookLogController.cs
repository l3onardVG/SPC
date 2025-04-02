using Microsoft.AspNetCore.Mvc;
using SPC.Business.Interfaces;
using SPC.Data.Models;
namespace SPC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

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

        [HttpGet]
        [Route("GetBookLogById/{id}")]
        public async Task<IActionResult> GetBookLogById(int id)
        {
            var result = await _bookLogService.FindById(id);
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
      return Ok(result);
    }

    [HttpGet("ratings/{bookId}")]
    public async Task<IActionResult> GetRatings(int bookId)
    {
        var ratings = await _bookLogService.GetRatingsForBook(bookId);
        return Ok(ratings);
    }
  }
}