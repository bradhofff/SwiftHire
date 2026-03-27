using Microsoft.EntityFrameworkCore;
using SwiftHireApi.Models.Entities;

namespace SwiftHireApi.Data;

public class SwiftHireDbContext : DbContext
{
    public SwiftHireDbContext(DbContextOptions<SwiftHireDbContext> options) : base(options) { }

    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<SavedJob> SavedJobs => Set<SavedJob>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Job indexes
        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasIndex(j => j.ExternalId).IsUnique();
            entity.HasIndex(j => j.PostedAt);
            entity.HasIndex(j => j.WorkModel);
            entity.HasIndex(j => j.JobType);
        });

        // Company indexes
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasIndex(c => c.AtsSlug);
        });

        // SavedJob indexes
        modelBuilder.Entity<SavedJob>(entity =>
        {
            entity.HasIndex(s => s.UserId);
            entity.HasIndex(s => s.JobId);
        });
    }
}
