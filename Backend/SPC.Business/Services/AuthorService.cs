
using SPC.Business.Interfaces;
using SPC.Data;
using SPC.Data.Models;
using System.Net;

namespace SPC.Business.Services;

public class AuthorService : IAuthorService
{
    private readonly IUnitOfWork _unitOfWork;
    public AuthorService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseMessage<Author>> AddAuthor(Author author)
    {
        var isValid = ValidateModel(author);
        if (!string.IsNullOrEmpty(isValid))
        {
            return BuildResponse(new(), isValid, HttpStatusCode.BadRequest);
        }
        try
        {

            await _unitOfWork.AuthorRepository.AddAsync(author);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Author>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }


        return new BaseMessage<Author>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<Author> { author }
        };

    }

    public async Task<BaseMessage<Author>> FindById(int id)
    {
        Author? author = new();
        author = await _unitOfWork.AuthorRepository.FindAsync(id);

        return author != null ?
            BuildResponse(new List<Author>() { author }, "", HttpStatusCode.OK, 1) :
            BuildResponse(new List<Author>(), "Author Not Found", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<Author>> FindByName(string name)
    {
        var lista = await _unitOfWork.AuthorRepository.GetAllAsync(x => x.Name.ToLower().Contains(name.ToLower()));
        return lista.Any() ? BuildResponse(lista.ToList(), "", HttpStatusCode.OK, lista.Count()) :
            BuildResponse(lista.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<Author>> FindByProperties(string name, int year)
    {
        var lista = await _unitOfWork.AuthorRepository.GetAllAsync(x => x.Name.Contains(name));
        return lista.Any() ? BuildResponse(lista.ToList(), "", HttpStatusCode.OK, lista.Count()) :
            BuildResponse(lista.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<Author>> GetList()
    {
        var lista = await _unitOfWork.AuthorRepository.GetAllAsync();
        return lista.Any() ? BuildResponse(lista.ToList(), "", HttpStatusCode.OK, lista.Count()) :
            BuildResponse(lista.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<Author>> UpdateAuthor(Author author)
    {
        try
        {
            await _unitOfWork.AuthorRepository.Update(author);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Author>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<Author>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<Author> { author }
        };
    }

    public async Task<BaseMessage<Author>> DeleteAuthor(Author author)
    {
        try
        {
            await _unitOfWork.AuthorRepository.Delete(author);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Author>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<Author>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<Author> { author }
        };
    }

    public async Task<BaseMessage<Author>> DeleteAuthorId(int id)
    {
        Author? author = new();
        try
        {
            author = await _unitOfWork.AuthorRepository.FindAsync(id);
            if (author == null)
            {
                return new BaseMessage<Author>()
                {
                    Message = "Author Not Found",
                    StatusCode = HttpStatusCode.NotFound,
                    TotalElements = 0,
                    ResponseElements = new()
                };
            }
            await _unitOfWork.AuthorRepository.Delete(id);
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Author>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }

        return new BaseMessage<Author>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<Author> { author }
        };
    }

    public async Task<BaseMessage<Author>> AddAuthors(List<Author> authors)
    {
        if (authors == null || !authors.Any())
        {
            return BuildResponse(new(), "The author list cannot be empty.", HttpStatusCode.BadRequest);
        }

        foreach (var author in authors)
        {
            var isValid = ValidateModel(author);
            if (!string.IsNullOrEmpty(isValid))
            {
                return BuildResponse(new(), isValid, HttpStatusCode.BadRequest);
            }
        }

        try
        {
            foreach (var author in authors)
            {
                await _unitOfWork.AuthorRepository.AddAsync(author);
            }
            await _unitOfWork.SaveAsync();
        }
        catch (Exception ex)
        {
            return new BaseMessage<Author>()
            {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new()
            };
        }


        return new BaseMessage<Author>()
        {
            Message = "",
            StatusCode = HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = authors.ToList()
        };

    }

    private BaseMessage<Author> BuildResponse(List<Author> lista, string message = "", HttpStatusCode status = HttpStatusCode.OK, int totalElements = 0)
    {
        return new BaseMessage<Author>()
        {
            Message = message,
            StatusCode = status,
            TotalElements = totalElements,
            ResponseElements = lista
        };
    }

    private string ValidateModel(Author author)
    {
        string message = String.Empty;

        if (string.IsNullOrEmpty(author.Name))
        {
            message += "El nombre es requerido";
        }
        if (string.IsNullOrEmpty(author.Surname))
        {
            message += "El apellido es requerido";
        }

        return message;
    }

    #region Learning to Test
    public async Task<string> TestAuthorCreation(Author author)
    {
        return ValidateModel(author);
    }
    #endregion


}