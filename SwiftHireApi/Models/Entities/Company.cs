using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwiftHireApi.Models.Entities;

public class Company
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? AtsProvider { get; set; }

    public string? AtsSlug { get; set; }

    public string? Stage { get; set; }

    public string? H1bHistory { get; set; }

    public bool IsStaffingAgency { get; set; }

    public string? Website { get; set; }

    [Column(TypeName = "decimal(3,1)")]
    public decimal? GlassdoorRating { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? LastFetchedAt { get; set; }

    // Navigation
    public ICollection<Job> Jobs { get; set; } = new List<Job>();
}
