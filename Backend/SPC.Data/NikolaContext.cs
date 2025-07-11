using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SPC.Data.Models;

public class NikolaContext : IdentityDbContext<ApplicationUser>
{
    public NikolaContext(DbContextOptions<NikolaContext> options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }

    public DbSet<Author> Author { get; set; }
    public DbSet<Book> Book { get; set; }
    public DbSet<BookLog> BookLog { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        if (builder == null)
        {
            return;
        }

        builder.Entity<Author>().ToTable("Author").HasKey(k => k.Id);
        builder.Entity<Book>().ToTable("Book").HasKey(k => k.Id);
        builder.Entity<BookLog>().ToTable("BookLog").HasKey(k => k.Id);
        
        // Configure RefreshToken entity
        builder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("RefreshTokens");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Token).IsRequired().HasMaxLength(500);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.ExpiryDate).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            
            // Index for performance
            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasIndex(e => e.UserId);
            
            // Relationship with ApplicationUser
            entity.HasOne(e => e.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
        
        base.OnModelCreating(builder);
    }
}