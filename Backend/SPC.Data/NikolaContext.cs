using Microsoft.EntityFrameworkCore;
using SPC.Data.Models;

public class NikolaContext : DbContext
{
    public NikolaContext(DbContextOptions<NikolaContext> options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }

    public DbSet<Author> Author {get;set;}
    public DbSet<Book> Book {get;set;}
    public DbSet<BookLog> BookLog {get;set;}
    public DbSet<User> User {get;set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        if(builder == null)
        {
            return;
        }

        builder.Entity<Author>().ToTable("Author").HasKey(k => k.Id);
        builder.Entity<Book>().ToTable("Book").HasKey(k => k.Id);
        builder.Entity<BookLog>().ToTable("BookLog").HasKey(k => k.Id);
        builder.Entity<User>().ToTable("User").HasKey(k => k.Id);
        base.OnModelCreating(builder);


    }
}