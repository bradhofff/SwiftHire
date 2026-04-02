using Microsoft.EntityFrameworkCore;
using SwiftHireApi.Models.Entities;

namespace SwiftHireApi.Data;

public class SwiftHireDbContext : DbContext
{
    public SwiftHireDbContext(DbContextOptions<SwiftHireDbContext> options) : base(options) { }

    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<SavedJob> SavedJobs => Set<SavedJob>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Resume> Resumes => Set<Resume>();

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

        // User indexes + precision
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.UserId);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.SalaryMin).HasPrecision(18, 2);
            entity.Property(u => u.SalaryMax).HasPrecision(18, 2);
        });

        // Resume indexes
        modelBuilder.Entity<Resume>(entity =>
        {
            entity.HasIndex(r => r.UserId);
        });
    }
}
