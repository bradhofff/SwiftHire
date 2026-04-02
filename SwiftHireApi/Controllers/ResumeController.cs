using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwiftHireApi.Data;
using SwiftHireApi.Models.DTOs;
using SwiftHireApi.Models.Entities;
using UglyToad.PdfPig;

namespace SwiftHireApi.Controllers;

[ApiController]
[Route("api/resume")]
public class ResumeController : ControllerBase
{
    private readonly SwiftHireDbContext _db;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ResumeController> _logger;

    private const int HardcodedUserId = 1;
    private const int MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB
    private static readonly string[] AllowedExtensions = { ".pdf", ".doc", ".docx" };

    public ResumeController(SwiftHireDbContext db, IWebHostEnvironment env, ILogger<ResumeController> logger)
    {
        _db = db;
        _env = env;
        _logger = logger;
    }

    // ── GET /api/resume ───────────────────────────────────────────────────────

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var resumes = await _db.Resumes
            .Where(r => r.UserId == HardcodedUserId)
            .OrderByDescending(r => r.IsPrimary)
            .ThenByDescending(r => r.UploadedAt)
            .Select(r => new ResumeDto
            {
                Id = r.Id,
                Name = r.Name,
                TargetJobTitle = r.TargetJobTitle,
                FileName = r.FileName,
                FilePath = r.FilePath,
                UploadedAt = r.UploadedAt,
                LastModifiedAt = r.LastModifiedAt,
                IsPrimary = r.IsPrimary,
                AnalysisStatus = r.AnalysisStatus,
            })
            .ToListAsync();

        return Ok(resumes);
    }

    // ── POST /api/resume/upload ───────────────────────────────────────────────

    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "No file provided." });

        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { error = "File exceeds the 10 MB size limit." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { error = "File must be a PDF or Word document (.pdf, .doc, .docx)." });

        // ── Save file ─────────────────────────────────────────────────────────
        var webRoot = _env.WebRootPath
            ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads", "resumes");
        Directory.CreateDirectory(uploadsDir);

        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var diskFileName = $"user_{HardcodedUserId}_{timestamp}{ext}";
        var diskPath = Path.Combine(uploadsDir, diskFileName);

        await using (var stream = System.IO.File.Create(diskPath))
        {
            await file.CopyToAsync(stream);
        }

        _logger.LogInformation("Saved resume file: {Path}", diskPath);

        // ── Create DB record ──────────────────────────────────────────────────
        var isPrimary = !await _db.Resumes.AnyAsync(r => r.UserId == HardcodedUserId);

        // ── Extract text (PDF only) ───────────────────────────────────────────
        var resumeText = ext == ".pdf" ? ExtractPdfText(diskPath) : string.Empty;

        var resume = new Resume
        {
            UserId = HardcodedUserId,
            Name = Path.GetFileNameWithoutExtension(file.FileName),
            FileName = file.FileName,
            FilePath = $"/uploads/resumes/{diskFileName}",
            UploadedAt = DateTime.UtcNow,
            LastModifiedAt = DateTime.UtcNow,
            IsPrimary = isPrimary,
            AnalysisStatus = "Complete",
            ResumeText = string.IsNullOrWhiteSpace(resumeText) ? null : resumeText,
        };

        _db.Resumes.Add(resume);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            resumeId = resume.Id,
            fileName = resume.FileName,
            uploadedAt = resume.UploadedAt,
        });
    }

    // ── PATCH /api/resume/{id}/details ────────────────────────────────────────

    [HttpPatch("{id:int}/details")]
    public async Task<IActionResult> UpdateDetails(int id, [FromBody] ResumeDetailsDto body)
    {
        var resume = await _db.Resumes.FindAsync(id);
        if (resume is null || resume.UserId != HardcodedUserId)
            return NotFound();

        if (!string.IsNullOrWhiteSpace(body.ResumeName))
            resume.Name = body.ResumeName.Trim();

        resume.TargetJobTitle = body.TargetJobTitle?.Trim();
        resume.LastModifiedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new ResumeDto
        {
            Id = resume.Id,
            Name = resume.Name,
            TargetJobTitle = resume.TargetJobTitle,
            FileName = resume.FileName,
            FilePath = resume.FilePath,
            UploadedAt = resume.UploadedAt,
            LastModifiedAt = resume.LastModifiedAt,
            IsPrimary = resume.IsPrimary,
            AnalysisStatus = resume.AnalysisStatus,
        });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static string ExtractPdfText(string diskPath)
    {
        try
        {
            using var doc = PdfDocument.Open(diskPath);
            var sb = new System.Text.StringBuilder();
            foreach (var page in doc.GetPages())
                sb.AppendLine(page.Text);
            return sb.ToString().Trim();
        }
        catch (Exception)
        {
            return string.Empty;
        }
    }
}

// ── Inline request body DTO ───────────────────────────────────────────────────

public class ResumeDetailsDto
{
    public string? ResumeName { get; set; }
    public string? TargetJobTitle { get; set; }
}
