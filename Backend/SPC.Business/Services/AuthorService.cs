
using SPC.Business.Interfaces;
using SPC.Data;
using SPC.Data.Models;
using System.Net;



public class AlbumService : IAuthorService
{
    private readonly IUnitOfWork _unitOfWork;
    private List<Author> _listaAlbum = new();
    public AlbumService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseMessage<Author>> AddAuthor(Author album)
    {

        try{

            await _unitOfWork.AuthorRepository.AddAsync(album);
            await _unitOfWork.SaveAsync();
        }
        catch(Exception ex)
        {
            return new BaseMessage<Author>() {
                Message = $"[Exception]: {ex.Message}",
                StatusCode = System.Net.HttpStatusCode.InternalServerError,
                TotalElements = 0,
                ResponseElements = new ()
            };
        }


        return new BaseMessage<Author>() {
            Message = "",
            StatusCode = System.Net.HttpStatusCode.OK,
            TotalElements = 1,
            ResponseElements = new List<Author>{album}
        };

    }

    public async Task<BaseMessage<Author>> FindById(int id)
    {
        Author? album = new();
        album = await _unitOfWork.AuthorRepository.FindAsync(id);

        return album != null ?
            BuildResponse(new List<Author>(){album}, "", HttpStatusCode.OK, 1) :
            BuildResponse(new List<Author>(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<Author>> FindByName(string name)
    {
        var lista = await _unitOfWork.AuthorRepository.GetAllAsync(x => x.Name.ToLower().Contains(name.ToLower()));
        return lista.Any() ?  BuildResponse(lista.ToList(), "", HttpStatusCode.OK, lista.Count()) :
            BuildResponse(lista.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<Author>> FindByProperties(string name, int year)
    {
        var lista = await _unitOfWork.AuthorRepository.GetAllAsync(x => x.Name.Contains(name) && x.Year == year);
        return lista.Any() ?  BuildResponse(lista.ToList(), "", HttpStatusCode.OK, lista.Count()) :
            BuildResponse(lista.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<Author>> GetList()
    {
        var lista = await _unitOfWork.AuthorRepository.GetAllAsync();
        return lista.Any() ?  BuildResponse(lista.ToList(), "", HttpStatusCode.OK, lista.Count()) :
            BuildResponse(lista.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    private BaseMessage<Author> BuildResponse(List<Author> lista, string message = "", HttpStatusCode status = HttpStatusCode.OK,
        int totalElements = 0)
    {
        return new BaseMessage<Author>(){
            Message = message,
            StatusCode = status,
            TotalElements = totalElements,
            ResponseElements = lista
        };
    }


}