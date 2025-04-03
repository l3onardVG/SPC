using Microsoft.AspNetCore.Mvc;
using SPC.Business.Interfaces;
using SPC.Data.Models;

namespace SPC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorService _authorService;

        public AuthorController(IAuthorService authroService)
        {
            _authorService = authroService;
        }

        [HttpGet]
        [Route("GetAllAuthors")]
        public async Task<IActionResult> GetAllAuthors()
        {
            var albums = await _authorService.GetList();
            return Ok(albums);
        }

        [HttpPost]
        [Route("AddAuthor")]
        public async Task<IActionResult> AddAuthor(Author author)
        {
            var result = await _authorService.AddAuthor(author);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAuthorById/{id}")]
        public async Task<IActionResult> GetAuthorById(int id)
        {
            var author = await _authorService.FindById(id);
            if (author.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(author);
            }
            return Ok(author);
        }

        [HttpPut]
        [Route("UpdateAuthor")]
        public async Task<IActionResult> UpdateAuthor(Author author)
        {
            var result = await _authorService.UpdateAuthor(author);
            return Ok(result);
        }

        [HttpDelete]
        [Route("DeleteAuthor")]
        public async Task<IActionResult> DeleteAuthor(Author author)
        {
            await _authorService.DeleteAuthor(author);
            return Ok(author);
        }

        [HttpDelete]
        [Route("DeleteAuthorById/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _authorService.DeleteAuthorId(id);
            if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPost]
        [AdminOrReadOnly]
        [Route("AddAuthors")]
        public async Task<IActionResult> AddAuthors(List<Author> authors)
        {
            var result = await _authorService.AddAuthors(authors);
            return Ok(result);
        }

    }
}