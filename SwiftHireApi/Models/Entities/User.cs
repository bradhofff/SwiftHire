using System.ComponentModel.DataAnnotations;

namespace SwiftHireApi.Models.Entities;

public class User
{
    public int UserId { get; set; }

    [Required]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    public string? PasswordHash { get; set; }

    [MaxLength(100)]
    public string? FirstName { get; set; }

    [MaxLength(100)]
    public string? LastName { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginAt { get; set; }

    // ── Job preferences (stored as JSON strings) ──────────────────────────────

    /// <summary>JSON array of preferred job titles, e.g. ["Software Engineer", "Backend Developer"]</summary>
    public string? PreferredTitles { get; set; }

    /// <summary>JSON array of preferred locations, e.g. ["New York, NY", "Remote"]</summary>
    public string? PreferredLocations { get; set; }

    /// <summary>JSON array of work model preferences, e.g. ["Remote", "Hybrid"]</summary>
    public string? WorkModels { get; set; }

    /// <summary>JSON array of job type preferences, e.g. ["Full-time", "Contract"]</summary>
    public string? JobTypes { get; set; }

    // ── Salary expectations ───────────────────────────────────────────────────

    public decimal? SalaryMin { get; set; }

    public decimal? SalaryMax { get; set; }

    // ── Experience ────────────────────────────────────────────────────────────

    /// <summary>1=Entry, 2=Mid, 3=Senior, 4=Lead, 5=Director</summary>
    public int? ExperienceLevel { get; set; }

    public int? YearsOfExperience { get; set; }

    public bool OpenToRelocation { get; set; } = false;

    // ── Resume ────────────────────────────────────────────────────────────────

    /// <summary>Raw text extracted from the uploaded resume PDF, used for match scoring.</summary>
    public string? ResumeText { get; set; }

    [MaxLength(256)]
    public string? ResumeFileName { get; set; }

    public DateTime? ResumeUploadedAt { get; set; }

    // ── Onboarding ────────────────────────────────────────────────────────────

    public bool OnboardingComplete { get; set; } = false;

    public int OnboardingStep { get; set; } = 0;
}
