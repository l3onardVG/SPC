using Microsoft.EntityFrameworkCore;
using SPC.Data.Models;
namespace SPC.Data;
public class UnitOfWork : IUnitOfWork
{
    private readonly NikolaContext _context;
    private IRepository<int, Author> _authorRepository;
    private IRepository<int, Book> _bookRepository;
    private IRepository<int, BookLog> _bookLogRepository;
    private IRepository<int, User> _userLogRepository;
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

    public IRepository<int, Book> BookRepository
    {
        get
        {
            _bookRepository ??= new Repository<int, Book>(_context);
            return _bookRepository;
        }

    }

    public IRepository<int, BookLog> BookLogRepository
    {
        get
        {
            _bookLogRepository ??= new Repository<int, BookLog>(_context);
            return _bookLogRepository;
        }

    }

    public IRepository<int, User> UserRepository
    {
        get
        {
            _userLogRepository ??= new Repository<int, User>(_context);
            return _userLogRepository;
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