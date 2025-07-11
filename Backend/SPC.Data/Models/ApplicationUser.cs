using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Identity;

namespace SPC.Data.Models;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string DocumentNumber { get; set; } = string.Empty;
    public bool TermsAceptance { get; set; } = false;
    public string UserType { get; set; } = string.Empty;
    
    // Navigation property for refresh tokens
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}