using System.ComponentModel.DataAnnotations;
using System.Data.Common;

namespace SPC.Business.Dtos;

public class UserDetail
{
    public string Id { get; set; }
    public string? Name { get; set; }
    public string? Surname { get; set; }

    public string? Email { get; set; }
    public string? DocumentType { get; set; }
    public string? DocumentNumber { get; set; }
    public bool? TermsAceptance { get; set; }
    public string? UserType { get; set; }
    public string? PhoneNumber { get; set; }

}
