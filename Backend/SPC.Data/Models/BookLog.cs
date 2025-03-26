using System.ComponentModel.DataAnnotations.Schema;

namespace SPC.Data.Models;

public class BookLog : BaseEntity<int>
{
  public Action Action{get; set;}
  [ForeignKey("UserId")]
  public int UserId{get; set;}
  [ForeignKey("BookId")]
  public int BookId{get; set;}
  public DateTime Timestamp{get; set;}

    public virtual User? User { get; set; }
    public virtual Book? Book { get; set; }

}

public enum Action
{
  Read,
  Like,
  Download,
  View,
  Delete,
  Update,
  Create
}