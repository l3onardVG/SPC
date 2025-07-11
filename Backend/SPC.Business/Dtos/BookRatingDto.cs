using System.ComponentModel.DataAnnotations;

namespace SPC.Business.Dtos;

public class BookRatingDto
{
    [Required]
    [Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5")]
    public int Rating { get; set; }
    
    public string? Comment { get; set; }
} 