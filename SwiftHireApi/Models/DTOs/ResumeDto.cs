namespace SwiftHireApi.Models.DTOs;

public class ResumeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? TargetJobTitle { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
    public DateTime LastModifiedAt { get; set; }
    public bool IsPrimary { get; set; }
    public string AnalysisStatus { get; set; } = string.Empty;
}
