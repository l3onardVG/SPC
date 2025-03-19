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

    }
}