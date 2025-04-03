using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SPC.Business.Dtos;
using SPC.Business.Interfaces;
using SPC.Data.Models;
namespace SPC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly IWebHostEnvironment _env;

        public BookController(IBookService bookService, IWebHostEnvironment env)
        {
            _bookService = bookService;
            _env = env;
        }

        [HttpGet]
        [Route("GetAllBooks")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _bookService.GetList();
            return Ok(books);
        }

        [HttpPost]
        [AdminOrReadOnly]
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
            if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPut]
        [AdminOrReadOnly]
        [Route("UpdateBook")]
        public async Task<IActionResult> UpdateBook(Book book)
        {
            var result = await _bookService.UpdateBook(book);
            return Ok(result);
        }

        [HttpDelete]
        [AdminOrReadOnly]
        [Route("DeleteBook")]
        public async Task<IActionResult> DeleteBook(Book book)
        {
            await _bookService.DeleteBook(book);
            return Ok(book);
        }

        [HttpDelete]
        [AdminOrReadOnly]
        [Route("DeleteBookById/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _bookService.DeleteBookId(id);
            if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
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
        [AdminOrReadOnly]
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


        [HttpPost]
        [AdminOrReadOnly]
        [Route("uploadFile/{id}")]
        public async Task<IActionResult> UploadFile(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
            return BadRequest("No file uploaded.");
            }
            // Define storage path (inside "Uploads" folder)
            string uploadFolder = Path.Combine(_env.ContentRootPath, "Uploads");
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }
            // Save the file with a unique name
            string uniqueFileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            string filePath = Path.Combine(uploadFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            // Retrieve the element
            try
            {
                var bookResponse = await _bookService.FindById(id);
                var book = bookResponse.ResponseElements.First();
                book.FilePath = filePath;
                var response = await _bookService.UpdateBook(book);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(400, $"Book Not found: {ex.Message}");
            }
        }


        [HttpGet("GetBookFile/{id}")]
        public async Task<IActionResult> GetFile(int id)
        {
            try
            {
                var bookResponse = await _bookService.FindById(id);
                var book = bookResponse.ResponseElements.First();
                var filePath = book.FilePath;
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("File not found.");
                }

                var contentType = "application/octet-stream";
                var fileName = book.Name;

                return PhysicalFile(filePath, contentType, fileName);

            } catch (Exception ex)
            {
                 return StatusCode(400, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [AdminOrReadOnly]
        [Route("AddBooks")]
        public async Task<IActionResult> AddBooks(List<Book> books)
        {
            var result = await _bookService.AddBooks(books);
            return Ok(result);
        }

    }
}
