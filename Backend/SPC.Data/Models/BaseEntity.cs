using System.ComponentModel.DataAnnotations;

namespace SPC.Data.Models;
public class BaseEntity<TId>
where TId : struct
{
    [Key]
    public TId Id { get; set; }
}