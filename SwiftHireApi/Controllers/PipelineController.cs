using Microsoft.AspNetCore.Mvc;
using SwiftHireApi.Models.DTOs;

namespace SwiftHireApi.Controllers;

[ApiController]
[Route("api/pipeline")]
public class PipelineController : ControllerBase
{
    /// <summary>Get saved jobs for the current user, optionally filtered by status.</summary>
    [HttpGet]
    public IActionResult GetPipeline([FromQuery] string? status)
    {
        // TODO: Wire to DB — query SavedJobs for authenticated user, filter by status
        var mockData = new List<SavedJobDto>();
        return Ok(mockData);
    }

    /// <summary>Update the status of a saved job.</summary>
    [HttpPatch("{id:int}")]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateStatusRequest body)
    {
        // TODO: Update SavedJob.Status in DB for authenticated user
        return Ok(new { message = "Status updated", id, status = body.Status });
    }
}

public record UpdateStatusRequest(string Status);
