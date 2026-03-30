using System.Text.Json;
using System.Text.Json.Serialization;
using SwiftHireApi.Models.DTOs;
using SwiftHireApi.Services.Interfaces;

namespace SwiftHireApi.Services;

public class AdzunaService : IAdzunaService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;
    private readonly ILogger<AdzunaService> _logger;

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public AdzunaService(HttpClient http, IConfiguration config, ILogger<AdzunaService> logger)
    {
        _http = http;
        _config = config;
        _logger = logger;
    }

    public async Task<PagedResult<JobDto>> SearchAsync(JobSearchFiltersDto filters)
    {
        var appId = _config["Adzuna:AppId"];
        var appKey = _config["Adzuna:AppKey"];
        var baseUrl = _config["Adzuna:BaseUrl"];

        var query = BuildQueryString(filters, appId!, appKey!);
        var url = $"{baseUrl}/us/search/{filters.Page}?{query}";

        _logger.LogInformation("Fetching jobs from Adzuna: {Url}", url);

        var response = await _http.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var bytes = await response.Content.ReadAsByteArrayAsync();
        var body = System.Text.Encoding.UTF8.GetString(bytes);
        var result = JsonSerializer.Deserialize<AdzunaResponse>(body, _jsonOptions);

        if (result is null)
            return new PagedResult<JobDto> { Page = filters.Page, PageSize = filters.PageSize };

        return new PagedResult<JobDto>
        {
            Items = result.Results.Select(r => MapToDto(r)).ToList(),
            TotalCount = result.Count,
            Page = filters.Page,
            PageSize = filters.PageSize,
        };
    }

    private static string BuildQueryString(JobSearchFiltersDto filters, string appId, string appKey)
    {
        var parts = new List<string>
        {
            $"app_id={appId}",
            $"app_key={appKey}",
            $"results_per_page={filters.PageSize}",
            "sort_by=date",
        };

        // Keyword query — use job functions or a broad default
        var what = filters.JobFunctions.Count > 0
            ? Uri.EscapeDataString(string.Join(" ", filters.JobFunctions))
            : "software+engineer";
        parts.Add($"what={what}");

        // Job type filters
        if (filters.JobTypes.Count > 0)
        {
            if (filters.JobTypes.Contains(1)) parts.Add("permanent=1");   // Full-time
            if (filters.JobTypes.Contains(2)) parts.Add("contract=1");    // Contract
            if (filters.JobTypes.Contains(3)) parts.Add("part_time=1");   // Part-time
            // Internship (4) has no direct Adzuna param — handled via keyword
        }

        // Salary filters
        if (filters.SalaryMin.HasValue)
            parts.Add($"salary_min={filters.SalaryMin.Value}");
        if (filters.SalaryMax.HasValue)
            parts.Add($"salary_max={filters.SalaryMax.Value}");

        // Recency filter
        if (filters.DaysAgo.HasValue)
            parts.Add($"max_days_old={filters.DaysAgo.Value}");

        return string.Join("&", parts);
    }

    private static JobDto MapToDto(AdzunaJob job) => new()
    {
        ExternalId = $"adzuna-{job.Id}",
        Title = job.Title,
        CompanyName = job.Company?.DisplayName ?? string.Empty,
        Location = job.Location?.DisplayName,
        ApplyUrl = job.RedirectUrl,
        AtsSource = "adzuna",
        SalaryMin = job.SalaryMin.HasValue ? (decimal)job.SalaryMin.Value : null,
        SalaryMax = job.SalaryMax.HasValue ? (decimal)job.SalaryMax.Value : null,
        SalaryType = job.SalaryMin.HasValue || job.SalaryMax.HasValue ? "annual" : null,
        JobType = MapContractTime(job.ContractTime, job.ContractType),
        Tags = job.Category?.Label is not null ? new List<string> { job.Category.Label } : new(),
        Posted = FormatPostedTime(job.Created),
    };

    private static string? MapContractTime(string? contractTime, string? contractType)
    {
        if (contractTime == "full_time") return "Full-time";
        if (contractTime == "part_time") return "Part-time";
        if (contractType == "contract") return "Contract";
        if (contractType == "permanent") return "Full-time";
        return null;
    }

    private static string FormatPostedTime(DateTime? created)
    {
        if (created is null) return "Recently";
        var diff = DateTime.UtcNow - created.Value;
        if (diff.TotalDays < 1) return "Today";
        if (diff.TotalDays < 2) return "1 day ago";
        if (diff.TotalDays < 7) return $"{(int)diff.TotalDays} days ago";
        if (diff.TotalDays < 14) return "1 week ago";
        return $"{(int)(diff.TotalDays / 7)} weeks ago";
    }

    // ── Adzuna API response models ─────────────────────────────────────────────

    private class AdzunaResponse
    {
        [JsonPropertyName("count")]
        public int Count { get; set; }

        [JsonPropertyName("results")]
        public List<AdzunaJob> Results { get; set; } = new();
    }

    private class AdzunaJob
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("company")]
        public AdzunaCompany? Company { get; set; }

        [JsonPropertyName("location")]
        public AdzunaLocation? Location { get; set; }

        [JsonPropertyName("category")]
        public AdzunaCategory? Category { get; set; }

        [JsonPropertyName("redirect_url")]
        public string? RedirectUrl { get; set; }

        [JsonPropertyName("created")]
        public DateTime? Created { get; set; }

        [JsonPropertyName("salary_min")]
        public double? SalaryMin { get; set; }

        [JsonPropertyName("salary_max")]
        public double? SalaryMax { get; set; }

        [JsonPropertyName("contract_type")]
        public string? ContractType { get; set; }

        [JsonPropertyName("contract_time")]
        public string? ContractTime { get; set; }
    }

    private class AdzunaCompany
    {
        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; } = string.Empty;
    }

    private class AdzunaLocation
    {
        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; } = string.Empty;
    }

    private class AdzunaCategory
    {
        [JsonPropertyName("label")]
        public string? Label { get; set; }
    }
}
