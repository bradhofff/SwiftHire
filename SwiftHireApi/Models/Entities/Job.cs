using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwiftHireApi.Models.Entities;

public class Job
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string ExternalId { get; set; } = string.Empty;

    [Required]
    public string Title { get; set; } = string.Empty;

    public int CompanyId { get; set; }

    public string? JobType { get; set; }

    public string? WorkModel { get; set; }

    public string? Location { get; set; }

    public string Country { get; set; } = "US";

    public string? ExperienceLevel { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? SalaryMin { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? SalaryMax { get; set; }

    public string? SalaryType { get; set; }

    public string? Description { get; set; }

    public string? ApplyUrl { get; set; }

    public DateTime PostedAt { get; set; }

    public DateTime ScrapedAt { get; set; }

    public bool IsActive { get; set; } = true;

    public string? H1bSponsorship { get; set; }

    public bool RequiresSecurityClearance { get; set; }

    public bool RequiresUsCitizen { get; set; }

    public string? AtsSource { get; set; }

    public string? ApplicantCount { get; set; }

    // Navigation
    [ForeignKey(nameof(CompanyId))]
    public Company? Company { get; set; }
}
