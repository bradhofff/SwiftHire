using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwiftHireApi.Models.Entities;

public class SavedJob
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    public int JobId { get; set; }

    public string Status { get; set; } = "Saved";

    [Column(TypeName = "decimal(5,2)")]
    public decimal? MatchScore { get; set; }

    public DateTime DateSaved { get; set; }

    public DateTime? DateApplied { get; set; }

    public DateTime? FollowUpDate { get; set; }

    public string? RecruiterName { get; set; }

    public string? RecruiterEmail { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? OfferAmount { get; set; }

    public string? Notes { get; set; }

    public DateTime? SyncedAt { get; set; }

    // Navigation
    [ForeignKey(nameof(JobId))]
    public Job? Job { get; set; }
}
