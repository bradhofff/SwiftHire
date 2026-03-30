using Microsoft.AspNetCore.Mvc;
using SwiftHireApi.Models.DTOs;
using SwiftHireApi.Services.Interfaces;

namespace SwiftHireApi.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly IAdzunaService _adzuna;

    public JobsController(IAdzunaService adzuna)
    {
        _adzuna = adzuna;
    }

    /// <summary>Search jobs with filters.</summary>
    [HttpPost("search")]
    public async Task<IActionResult> Search([FromBody] JobSearchFiltersDto filters)
    {
        var result = await _adzuna.SearchAsync(filters);
        // Return shape the frontend expects: { jobs, totalCount, page, pageSize }
        return Ok(new
        {
            jobs = result.Items,
            totalCount = result.TotalCount,
            page = result.Page,
            pageSize = result.PageSize,
        });
    }

    /// <summary>Get a single job by ID.</summary>
    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        // TODO: Fetch from DB once SQL Server is wired up
        return NotFound();
    }

    /// <summary>Save a job to the user's pipeline.</summary>
    [HttpPost("{id:int}/save")]
    public IActionResult Save(int id)
    {
        // TODO: Associate save with authenticated user and persist to SavedJobs
        return Ok(new { message = "Job saved" });
    }

    /// <summary>Like a job.</summary>
    [HttpPost("{id:int}/like")]
    public IActionResult Like(int id)
    {
        // TODO: Associate like with authenticated user and persist to SavedJobs
        return Ok(new { message = "Job liked" });
    }
}
