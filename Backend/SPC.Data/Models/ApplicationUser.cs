using Microsoft.AspNetCore.Identity;

namespace SPC.Data.Models;

public class ApplicationUser: IdentityUser
{
    public string DocumentType { get; set; }
    public string DocumentNumber { get; set; }
    public bool TermsAceptance { get; set; }
    public string UserType { get; set; }
}