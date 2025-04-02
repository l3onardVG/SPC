namespace SPC.Data.Models;

public class Author : BaseEntity<int>
{
    public string Name { get; set; } = String.Empty;
    public string Surname { get; set; } = String.Empty;
    public string About { get; set; } = String.Empty;
    public bool IsAlive { get; set; }
    public bool Deleted { get; set; } = false;
}
