namespace SwiftHireApi.Services.Interfaces;

public interface IJobIngestionService
{
    Task FetchAllActiveCompaniesAsync();
    Task FetchCompanyJobsAsync(int companyId);
}
