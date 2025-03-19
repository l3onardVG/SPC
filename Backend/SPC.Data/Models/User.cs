using SPC.Data.Models;

namespace SPC.Data.Models;

public class User : BaseEntity<int>
{
  public string Name{get; set;}
  public string Surname{get; set;}
  public string Email{get; set;}
  public Role Role{get; set;}

}

public enum Role
{
  User,
  Admin
}