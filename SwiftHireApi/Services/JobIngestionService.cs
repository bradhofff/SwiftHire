using Microsoft.EntityFrameworkCore;
using SwiftHireApi.Data;
using SwiftHireApi.Models.DTOs;
using SwiftHireApi.Services.Interfaces;

namespace SwiftHireApi.Services;

public class JobIngestionService : IJobIngestionService
{
    private readonly SwiftHireDbContext _db;
    private readonly ILogger<JobIngestionService> _logger;

    public JobIngestionService(SwiftHireDbContext db, ILogger<JobIngestionService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task FetchAllActiveCompaniesAsync()
    {
        var companies = await _db.Companies
            .Where(c => c.IsActive)
            .ToListAsync();

        _logger.LogInformation("Starting ingestion for {Count} active companies", companies.Count);

        foreach (var company in companies)
        {
            try
            {
                await FetchCompanyJobsAsync(company.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch jobs for company {CompanyId} ({CompanyName})", company.Id, company.Name);
            }
        }
    }

    public async Task FetchCompanyJobsAsync(int companyId)
    {
        var company = await _db.Companies.FindAsync(companyId);
        if (company is null)
        {
            _logger.LogWarning("Company {CompanyId} not found", companyId);
            return;
        }

        _logger.LogInformation("Fetching jobs for {CompanyName} via {AtsProvider}", company.Name, company.AtsProvider);

        List<JobDto> jobs = company.AtsProvider switch
        {
            "greenhouse" => await FetchGreenhouseJobsAsync(company),
            "lever" => await FetchLeverJobsAsync(company),
            "workable" => await FetchWorkableJobsAsync(company),
            _ => new List<JobDto>()
        };

        _logger.LogInformation("Fetched {Count} jobs for {CompanyName}", jobs.Count, company.Name);
        // TODO: Upsert jobs into the database
    }

    private Task<List<JobDto>> FetchGreenhouseJobsAsync(Models.Entities.Company company)
    {
        // TODO: Implement Greenhouse API fetch using company.AtsSlug
        _logger.LogInformation("Would fetch from Greenhouse for slug: {Slug}", company.AtsSlug);
        return Task.FromResult(new List<JobDto>());
    }

    private Task<List<JobDto>> FetchLeverJobsAsync(Models.Entities.Company company)
    {
        // TODO: Implement Lever API fetch using company.AtsSlug
        _logger.LogInformation("Would fetch from Lever for slug: {Slug}", company.AtsSlug);
        return Task.FromResult(new List<JobDto>());
    }

    private Task<List<JobDto>> FetchWorkableJobsAsync(Models.Entities.Company company)
    {
        // TODO: Implement Workable API fetch using company.AtsSlug
        _logger.LogInformation("Would fetch from Workable for slug: {Slug}", company.AtsSlug);
        return Task.FromResult(new List<JobDto>());
    }
}
