namespace SwiftHireApi.Models.DTOs;

public class SavedJobDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int JobId { get; set; }
    public string Status { get; set; } = "Saved";
    public decimal? MatchScore { get; set; }
    public DateTime DateSaved { get; set; }
    public DateTime? DateApplied { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public string? RecruiterName { get; set; }
    public string? Notes { get; set; }
    public decimal? OfferAmount { get; set; }

    /// <summary>Full job details nested inside the saved job record.</summary>
    public JobDto? Job { get; set; }
}
