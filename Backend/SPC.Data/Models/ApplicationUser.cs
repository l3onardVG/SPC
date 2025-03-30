using Microsoft.AspNetCore.Identity;

namespace SPC.Data.Models;

public class ApplicationUser: IdentityUser
{
    public string DocumentType { get; set; } = String.Empty;
    public string DocumentNumber { get; set; } = String.Empty;
    public bool TermsAceptance { get; set; } = false;
    public string UserType { get; set; } = String.Empty;
}