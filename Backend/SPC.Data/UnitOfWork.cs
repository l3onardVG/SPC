using Microsoft.EntityFrameworkCore;
using SPC.Data.Models;
namespace SPC.Data;
public class UnitOfWork : IUnitOfWork
{
    private readonly NikolaContext _context;
    private IRepository<int, Author> _authorRepository;
    private bool _disposed = false;

    public UnitOfWork(NikolaContext context)
    {
        _context = context;
    }

    public IRepository<int, Author> AuthorRepository
    {
        get
        {
            _authorRepository ??= new Repository<int, Author>(_context);
            return _authorRepository;
        }
    }

    public async Task SaveAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            ex.Entries.Single().Reload();
        }
    }

    #region IDisposable
    protected virtual void Dispose(bool disposing)
    {
        if(!_disposed)
        {
            if(disposing)
            {
                _context.DisposeAsync();
            }
        }
        _disposed = true;
    }

    public void Dispose()
    {
        Dispose(true);
    }
    #endregion
}