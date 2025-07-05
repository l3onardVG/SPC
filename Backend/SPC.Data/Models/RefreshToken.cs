using System.ComponentModel.DataAnnotations;

namespace SPC.Data.Models;

public class RefreshToken : BaseEntity<int>
{
    [Required]
    public string Token { get; set; } = string.Empty;
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    public DateTime ExpiryDate { get; set; }
    
    public bool IsRevoked { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public string? RevokedBy { get; set; }
    
    public DateTime? RevokedAt { get; set; }
    
    // Navigation property
    public virtual ApplicationUser? User { get; set; }
} 