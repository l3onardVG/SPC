using Microsoft.EntityFrameworkCore;
using SPC.Data.Models;

public class NikolaContext : DbContext
{
    public NikolaContext(DbContextOptions<NikolaContext> options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }

    public DbSet<Author> Author {get;set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        if(builder == null)
        {
            return;
        }

        builder.Entity<Author>().ToTable("Author").HasKey(k => k.Id);
        base.OnModelCreating(builder);


    }
}