using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;
using SwiftHireApi.Services.Interfaces;

namespace SwiftHireApi.Services;

public class ResumeStorageService : IResumeStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ResumeStorageService> _logger;

    // Relative to wwwroot
    private const string UploadFolder = "uploads/resumes";

    public ResumeStorageService(IWebHostEnvironment env, ILogger<ResumeStorageService> logger)
    {
        _env = env;
        _logger = logger;
    }

    public async Task<(string filePath, string extractedText)> SaveAndExtractAsync(
        int userId, Stream pdfStream, string fileName)
    {
        // ── 1. Ensure directory exists ─────────────────────────────────────────
        var uploadsDir = Path.Combine(_env.WebRootPath, UploadFolder);
        Directory.CreateDirectory(uploadsDir);

        // ── 2. Save to disk as {userId}.pdf ───────────────────────────────────
        var diskPath = Path.Combine(uploadsDir, $"{userId}.pdf");
        await using (var fs = new FileStream(diskPath, FileMode.Create, FileAccess.Write))
        {
            await pdfStream.CopyToAsync(fs);
        }

        _logger.LogInformation("Saved resume for user {UserId} to {Path}", userId, diskPath);

        // ── 3. Extract text ───────────────────────────────────────────────────
        var text = ExtractText(diskPath);

        // ── 4. Return relative public URL path + extracted text ───────────────
        var publicPath = $"/{UploadFolder}/{userId}.pdf";
        return (publicPath, text);
    }

    public Task DeleteAsync(int userId)
    {
        var diskPath = Path.Combine(_env.WebRootPath, UploadFolder, $"{userId}.pdf");
        if (File.Exists(diskPath))
        {
            File.Delete(diskPath);
            _logger.LogInformation("Deleted resume for user {UserId}", userId);
        }
        return Task.CompletedTask;
    }

    private static string ExtractText(string pdfPath)
    {
        try
        {
            using var doc = PdfDocument.Open(pdfPath);
            var sb = new System.Text.StringBuilder();

            foreach (Page page in doc.GetPages())
            {
                sb.AppendLine(page.Text);
            }

            return sb.ToString().Trim();
        }
        catch (Exception)
        {
            // Don't fail the upload if text extraction fails — just return empty
            return string.Empty;
        }
    }
}
