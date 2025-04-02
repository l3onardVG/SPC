using Microsoft.AspNetCore.Mvc;
using SPC.Business.Dtos;
using SPC.Business.Interfaces;
using SPC.Data.Models;
namespace SPC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        [Route("GetAllBooks")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _bookService.GetList();
            return Ok(books);
        }

        [HttpPost]
        [Route("AddBook")]
        public async Task<IActionResult> AddBook(Book book)
        {
            var result = await _bookService.AddBook(book);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetBookById/{id}")]
        public async Task<IActionResult> GetBookLogById(int id)
        {
            var result = await _bookService.FindById(id);
            return Ok(result);
        }

        [HttpPut]
        [Route("UpdateBook")]
        public async Task<IActionResult> UpdateBook(Book book)
        {
            var result = await _bookService.UpdateBook(book);
            return Ok(result);
        }

        [HttpDelete]
        [Route("DeleteBook")]
        public async Task<IActionResult> DeleteBook(Book book)
        {
            await _bookService.DeleteBook(book);
            return Ok(book);
        }

        [HttpDelete]
        [Route("DeleteBookById/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _bookService.DeleteBookId(id);
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Book>>> SearchBooks([FromQuery] BookSearchDto searchDto)
        {
            try
            {
                var books = await _bookService.SearchBooksAsync(searchDto);
                return Ok(books);
            }
            catch (Exception exception)
            {
                return StatusCode(500, $"Internal server error: {exception.Message}");
            }
        }

        [HttpPost]
        [Route("uploadImage/{id}")]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            try
            {
                var result = await _bookService.UploadBookImage(id, file);
                
                return result.StatusCode switch
                {
                    System.Net.HttpStatusCode.OK => Ok(result),
                    System.Net.HttpStatusCode.NotFound => NotFound(result),
                    System.Net.HttpStatusCode.BadRequest => BadRequest(result),
                    _ => StatusCode((int)System.Net.HttpStatusCode.InternalServerError, result)
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
