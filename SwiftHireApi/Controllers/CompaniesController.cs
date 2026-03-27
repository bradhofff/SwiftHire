using Microsoft.AspNetCore.Mvc;

namespace SwiftHireApi.Controllers;

[ApiController]
[Route("api/companies")]
public class CompaniesController : ControllerBase
{
    /// <summary>Get all companies.</summary>
    [HttpGet]
    public IActionResult GetAll()
    {
        // TODO: Return companies from DB
        return Ok(new List<object>());
    }

    /// <summary>Get a company by ID.</summary>
    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        // TODO: Return company from DB
        return NotFound();
    }
}
