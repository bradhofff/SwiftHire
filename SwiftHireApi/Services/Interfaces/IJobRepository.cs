using SwiftHireApi.Models.DTOs;

namespace SwiftHireApi.Services.Interfaces;

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public bool HasMore => Page * PageSize < TotalCount;
}

public interface IJobRepository
{
    Task<PagedResult<JobDto>> SearchAsync(JobSearchFiltersDto filters);
    Task<JobDto?> GetByIdAsync(int id);
    Task<JobDto?> GetByExternalIdAsync(string externalId);
    Task UpsertAsync(JobDto job);
    Task<bool> ExistsAsync(string externalId);
}
