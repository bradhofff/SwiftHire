using Microsoft.AspNetCore.Mvc;
using SwiftHireApi.Models.DTOs;
using SwiftHireApi.Services.Interfaces;

namespace SwiftHireApi.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly IJobRepository _jobRepository;

    public JobsController(IJobRepository jobRepository)
    {
        _jobRepository = jobRepository;
    }

    /// <summary>Search jobs with filters.</summary>
    [HttpPost("search")]
    public async Task<IActionResult> Search([FromBody] JobSearchFiltersDto filters)
    {
        var result = await _jobRepository.SearchAsync(filters);
        return Ok(result);
    }

    /// <summary>Get a single job by ID.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var job = await _jobRepository.GetByIdAsync(id);
        if (job is null) return NotFound();
        return Ok(job);
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
