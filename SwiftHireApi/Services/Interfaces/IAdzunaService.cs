using SwiftHireApi.Models.DTOs;

namespace SwiftHireApi.Services.Interfaces;

public interface IAdzunaService
{
    Task<PagedResult<JobDto>> SearchAsync(JobSearchFiltersDto filters);
}
