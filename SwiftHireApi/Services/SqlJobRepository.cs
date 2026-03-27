using Microsoft.EntityFrameworkCore;
using SwiftHireApi.Data;
using SwiftHireApi.Models.DTOs;
using SwiftHireApi.Models.Entities;
using SwiftHireApi.Services.Interfaces;

namespace SwiftHireApi.Services;

public class SqlJobRepository : IJobRepository
{
    private readonly SwiftHireDbContext _db;

    public SqlJobRepository(SwiftHireDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<JobDto>> SearchAsync(JobSearchFiltersDto filters)
    {
        var query = _db.Jobs
            .Include(j => j.Company)
            .Where(j => j.IsActive);

        // Work model filter
        if (filters.WorkModels.Count > 0)
        {
            var models = filters.WorkModels.Select(m => m switch
            {
                1 => "Onsite",
                2 => "Remote",
                3 => "Hybrid",
                _ => string.Empty
            }).Where(m => m != string.Empty).ToList();

            query = query.Where(j => j.WorkModel != null && models.Contains(j.WorkModel));
        }

        // Job type filter
        if (filters.JobTypes.Count > 0)
        {
            var types = filters.JobTypes.Select(t => t switch
            {
                1 => "Full-time",
                2 => "Contract",
                3 => "Part-time",
                4 => "Internship",
                _ => string.Empty
            }).Where(t => t != string.Empty).ToList();

            query = query.Where(j => j.JobType != null && types.Contains(j.JobType));
        }

        // Experience level filter
        if (filters.ExperienceLevels.Count > 0)
        {
            var levels = filters.ExperienceLevels.Select(l => l switch
            {
                1 => "Intern",
                2 => "Entry Level",
                3 => "Mid Level",
                4 => "Senior Level",
                5 => "Lead",
                6 => "Director",
                _ => string.Empty
            }).Where(l => l != string.Empty).ToList();

            query = query.Where(j => j.ExperienceLevel != null && levels.Contains(j.ExperienceLevel));
        }

        // Salary filter
        if (filters.SalaryMin.HasValue)
            query = query.Where(j => j.SalaryMax == null || j.SalaryMax >= filters.SalaryMin);

        // H1B filter
        if (filters.H1bRequired)
            query = query.Where(j => j.H1bSponsorship != null && j.H1bSponsorship != "No");

        // Security clearance filter
        if (filters.ExcludeSecurityClearance)
            query = query.Where(j => !j.RequiresSecurityClearance);

        // US citizen filter
        if (filters.ExcludeUsCitizenOnly)
            query = query.Where(j => !j.RequiresUsCitizen);

        // Days ago filter
        if (filters.DaysAgo.HasValue)
        {
            var cutoff = DateTime.UtcNow.AddDays(-filters.DaysAgo.Value);
            query = query.Where(j => j.PostedAt >= cutoff);
        }

        var totalCount = await query.CountAsync();

        var jobs = await query
            .OrderByDescending(j => j.PostedAt)
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        return new PagedResult<JobDto>
        {
            Items = jobs.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = filters.Page,
            PageSize = filters.PageSize,
        };
    }

    public async Task<JobDto?> GetByIdAsync(int id)
    {
        var job = await _db.Jobs
            .Include(j => j.Company)
            .FirstOrDefaultAsync(j => j.Id == id);

        return job is null ? null : MapToDto(job);
    }

    public async Task<JobDto?> GetByExternalIdAsync(string externalId)
    {
        var job = await _db.Jobs
            .Include(j => j.Company)
            .FirstOrDefaultAsync(j => j.ExternalId == externalId);

        return job is null ? null : MapToDto(job);
    }

    public Task UpsertAsync(JobDto job)
    {
        // TODO: Implement upsert using ExternalId as the key
        throw new NotImplementedException();
    }

    public async Task<bool> ExistsAsync(string externalId)
    {
        // TODO: Implement exists check
        return await _db.Jobs.AnyAsync(j => j.ExternalId == externalId);
    }

    private static JobDto MapToDto(Job job) => new()
    {
        Id = job.Id,
        ExternalId = job.ExternalId,
        Title = job.Title,
        CompanyName = job.Company?.Name ?? string.Empty,
        CompanyStage = job.Company?.Stage,
        Location = job.Location,
        WorkModel = job.WorkModel,
        JobType = job.JobType,
        SalaryMin = job.SalaryMin,
        SalaryMax = job.SalaryMax,
        SalaryType = job.SalaryType,
        ApplyUrl = job.ApplyUrl,
        AtsSource = job.AtsSource,
        Applicants = job.ApplicantCount,
        H1b = job.H1bSponsorship is "Yes" or "Likely",
        Posted = FormatPostedTime(job.PostedAt),
    };

    private static string FormatPostedTime(DateTime postedAt)
    {
        var diff = DateTime.UtcNow - postedAt;
        if (diff.TotalDays < 1) return "Today";
        if (diff.TotalDays < 2) return "1 day ago";
        if (diff.TotalDays < 7) return $"{(int)diff.TotalDays} days ago";
        if (diff.TotalDays < 14) return "1 week ago";
        return $"{(int)(diff.TotalDays / 7)} weeks ago";
    }
}
