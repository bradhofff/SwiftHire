namespace SwiftHireApi.Models.DTOs;

public class JobDto
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? CompanyStage { get; set; }
    public string? Logo { get; set; }
    public string? LogoColor { get; set; }
    public string? LogoText { get; set; }
    public List<string> Tags { get; set; } = new();
    public string? Posted { get; set; }
    public string? Location { get; set; }
    public string? WorkModel { get; set; }
    public string? JobType { get; set; }
    public string? Level { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public string? SalaryType { get; set; }
    public string? ExpRequired { get; set; }
    public string? Applicants { get; set; }
    public decimal? MatchScore { get; set; }
    public string? MatchTier { get; set; }
    public List<string> MatchBullets { get; set; } = new();
    public bool H1b { get; set; }
    public bool EarlyApplicant { get; set; }
    public string? ApplyUrl { get; set; }
    public string? AtsSource { get; set; }
    public string? Status { get; set; }
    public string? Description { get; set; }
}
