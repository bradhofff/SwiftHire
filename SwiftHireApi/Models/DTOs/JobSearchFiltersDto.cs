namespace SwiftHireApi.Models.DTOs;

public class JobSearchFiltersDto
{
    public List<string> JobFunctions { get; set; } = new();

    public List<string> ExcludedTitles { get; set; } = new();

    /// <summary>1=Full-time, 2=Contract, 3=Part-time, 4=Internship</summary>
    public List<int> JobTypes { get; set; } = new();

    /// <summary>1=Onsite, 2=Remote, 3=Hybrid</summary>
    public List<int> WorkModels { get; set; } = new();

    /// <summary>1=Intern, 2=Entry, 3=Mid, 4=Senior, 5=Lead, 6=Director</summary>
    public List<int> ExperienceLevels { get; set; } = new();

    public decimal? SalaryMin { get; set; }

    public decimal? SalaryMax { get; set; }

    public bool H1bRequired { get; set; }

    public bool ExcludeSecurityClearance { get; set; }

    public bool ExcludeUsCitizenOnly { get; set; }

    public int? DaysAgo { get; set; }

    public List<string> Industries { get; set; } = new();

    public List<string> Skills { get; set; } = new();

    public List<string> ExcludedSkills { get; set; } = new();

    public string? RoleType { get; set; }

    public List<string> CompanyStages { get; set; } = new();

    public bool ExcludeStaffingAgency { get; set; }

    public List<string> ExcludedCompanies { get; set; } = new();

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 20;
}
