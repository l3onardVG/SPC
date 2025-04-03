using System.ComponentModel.DataAnnotations.Schema;

namespace SPC.Data.Models;

public class Book : BaseEntity<int>
{
  [ForeignKey("AuthorId")]
  public int AuthorId{get; set;}
  public string Name{get; set;}
  public string ISBN13{get; set;}
  public string Editorial{get; set;}
  public int YearOfPubliction{get; set;}
  public Format Format{get; set;}
  public Genrre Genrre{get; set;}
  public string Language{get; set;}
  public string cover{get; set;}
  public string Edition{get; set;}
  public string Summary{get; set;}
  public bool Deleted{get; set;}
  public int Long{get; set;}
  public double AverageRating { get; set; } = 0;
  public string FilePath { get; set; }=string.Empty;
  public virtual Author? Author { get; set; }
}

public enum Format
{
    Book,
    AudioBook
}
public enum Genrre
{
    LiteraryFiction,
    HistoricalFiction,
    ScienceFiction,
    Fantasy,
    Adventure,
    MagicalRealism,
    Other
}