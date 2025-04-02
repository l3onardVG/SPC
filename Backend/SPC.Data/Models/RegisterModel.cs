using System.ComponentModel.DataAnnotations;

namespace SPC.Data.Models;

public class RegisterModel
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = String.Empty;
    [Required(ErrorMessage = "Surname is required")]
    public string Surname { get; set; } = String.Empty;
    [Required(ErrorMessage = "DocumentType is required")]
    public string DocumentType { get; set; } = String.Empty;
    [Required(ErrorMessage = "DocumentNumber is required")]
    public string DocumentNumber { get; set; } = String.Empty;
    [Required(ErrorMessage = "TermsAceptance is required")]
    public bool TermsAceptance { get; set; } = false;
    [Required(ErrorMessage = "UserType is required")]
    public string UserType { get; set; } = String.Empty;
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
    [EmailAddress]
    [Required(ErrorMessage = "Email is required")]
    public string Email { get; set; } = string.Empty;

}