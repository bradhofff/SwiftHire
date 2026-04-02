namespace SwiftHireApi.Models.Entities;

public class Resume
{
    public int Id { get; set; }

    public int UserId { get; set; }

    /// <summary>User-editable display name for this resume.</summary>
    public string Name { get; set; } = string.Empty;

    public string? TargetJobTitle { get; set; }

    /// <summary>Raw text extracted from the uploaded PDF (used for match scoring).</summary>
    public string? ResumeText { get; set; }

    /// <summary>Original uploaded filename, e.g. "John_Doe_Resume.pdf".</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>Public-relative path, e.g. "/uploads/resumes/user_1_1234567890.pdf".</summary>
    public string FilePath { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public DateTime LastModifiedAt { get; set; } = DateTime.UtcNow;

    public bool IsPrimary { get; set; }

    /// <summary>"Pending" | "Complete" | "Failed"</summary>
    public string AnalysisStatus { get; set; } = "Complete";
}
