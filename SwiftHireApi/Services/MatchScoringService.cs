using SwiftHireApi.Models.DTOs;
using SwiftHireApi.Models.Entities;

namespace SwiftHireApi.Services;

/// <summary>
/// Fast, zero-cost keyword-based resume ↔ job match scorer.
/// Runs in-process with no external API calls.
/// </summary>
public class MatchScoringService
{
    // ── Common tech / skill keywords ──────────────────────────────────────────
    private static readonly HashSet<string> TechKeywords = new(StringComparer.OrdinalIgnoreCase)
    {
        // Languages
        "python","javascript","typescript","java","c#","c++","go","rust","swift","kotlin",
        "ruby","php","scala","r","dart","bash","powershell","sql","html","css",
        // Frameworks / libraries
        "react","angular","vue","next.js","nextjs","node.js","nodejs","express","django",
        "flask","fastapi","spring","aspnet","asp.net","rails","laravel","flutter",
        // Cloud / DevOps
        "aws","azure","gcp","docker","kubernetes","k8s","terraform","ansible","jenkins",
        "github actions","ci/cd","cicd","linux","nginx","redis","kafka","rabbitmq",
        // Data / ML
        "machine learning","deep learning","tensorflow","pytorch","pandas","numpy",
        "spark","airflow","dbt","snowflake","bigquery","tableau","power bi",
        // Databases
        "postgresql","mysql","mongodb","sql server","sqlite","elasticsearch","dynamodb",
        // Practices
        "agile","scrum","rest","graphql","microservices","tdd","devops","git",
    };

    // ── Noise words to strip before keyword analysis ──────────────────────────
    private static readonly HashSet<string> StopWords = new(StringComparer.OrdinalIgnoreCase)
    {
        "a","an","the","and","or","but","in","on","at","to","for","of","with",
        "by","from","up","about","into","than","as","is","was","are","were",
        "be","been","being","have","has","had","do","does","did","will","would",
        "could","should","may","might","must","shall","can","need","not","no",
        "we","our","you","your","they","their","its","it","this","that","these",
        "those","which","who","whom","what","when","where","how","why","both",
        "each","other","some","such","only","own","same","so","than","too","very",
        "just","because","while","during","before","after","above","below","between",
        "through","across","work","working","experience","team","join","help","use",
        "using","used","role","position","looking","seeking","strong","excellent",
        "including","ensure","build","develop","support","manage","create","provide",
        "responsibilities","requirements","required","preferred","minimum","least",
        "ability","knowledge","skills","skill","year","years","month","months",
    };

    // ── Public API ────────────────────────────────────────────────────────────

    /// <summary>Score a single job against the user's profile and primary resume.</summary>
    public MatchResultDto ScoreJob(JobDto job, User? profile, Resume? primaryResume)
    {
        var resumeText = primaryResume?.ResumeText ?? profile?.ResumeText ?? string.Empty;
        var jobText    = $"{job.Title} {job.Description}";

        var resumeTokens = Tokenize(resumeText);
        var jobTokens    = Tokenize(jobText);

        // Sub-scores
        int keywordScore = ComputeKeywordScore(resumeTokens, jobTokens);
        int skillsScore  = ComputeSkillsScore(resumeTokens, jobText);
        int titleScore   = ComputeTitleScore(job.Title, profile, primaryResume);
        int prefsScore   = ComputePrefsScore(job, profile);

        // Weighted composite
        int composite = (int)Math.Round(
            keywordScore * 0.40 +
            skillsScore  * 0.35 +
            titleScore   * 0.15 +
            prefsScore   * 0.10
        );
        composite = Math.Clamp(composite, 0, 100);

        // Matched / missing keywords
        var jobTechWords = TechKeywords
            .Where(k => jobText.Contains(k, StringComparison.OrdinalIgnoreCase))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var matched = jobTechWords
            .Where(k => resumeText.Contains(k, StringComparison.OrdinalIgnoreCase))
            .OrderBy(k => k)
            .Take(8)
            .ToList();

        var missing = jobTechWords
            .Where(k => !resumeText.Contains(k, StringComparison.OrdinalIgnoreCase))
            .OrderBy(k => k)
            .Take(8)
            .ToList();

        return new MatchResultDto
        {
            Score         = composite,
            Tier          = GetTier(composite),
            KeywordScore  = keywordScore,
            SkillsScore   = skillsScore,
            TitleScore    = titleScore,
            PrefsScore    = prefsScore,
            MatchedKeywords = matched,
            MissingKeywords = missing,
        };
    }

    /// <summary>Score a batch of jobs. Returns map of ExternalId → MatchResult.</summary>
    public Dictionary<string, MatchResultDto> ScoreBatch(
        IEnumerable<JobDto> jobs,
        User? profile,
        Resume? primaryResume)
    {
        var result = new Dictionary<string, MatchResultDto>(StringComparer.Ordinal);
        foreach (var job in jobs)
        {
            if (!string.IsNullOrEmpty(job.ExternalId))
                result[job.ExternalId] = ScoreJob(job, profile, primaryResume);
        }
        return result;
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private static HashSet<string> Tokenize(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return new();
        return text
            .ToLowerInvariant()
            .Split(new[] { ' ', '\n', '\r', '\t', ',', '.', ';', ':', '(', ')', '[', ']', '/', '-', '_', '"', '\'' }, StringSplitOptions.RemoveEmptyEntries)
            .Where(w => w.Length > 2 && !StopWords.Contains(w))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    private static int ComputeKeywordScore(HashSet<string> resumeTokens, HashSet<string> jobTokens)
    {
        if (jobTokens.Count == 0) return 50; // no description → neutral
        if (resumeTokens.Count == 0) return 0;

        int overlap = jobTokens.Count(w => resumeTokens.Contains(w));
        double ratio = (double)overlap / Math.Min(jobTokens.Count, 80); // cap denominator
        return (int)Math.Clamp(ratio * 100, 0, 100);
    }

    private static int ComputeSkillsScore(HashSet<string> resumeTokens, string jobText)
    {
        if (string.IsNullOrWhiteSpace(jobText)) return 50;

        var requiredTech = TechKeywords
            .Where(k => jobText.Contains(k, StringComparison.OrdinalIgnoreCase))
            .ToList();

        if (requiredTech.Count == 0) return 70; // job has no specific tech → medium score

        int matched = requiredTech.Count(k =>
            resumeTokens.Contains(k) ||
            // also check multi-word skills (e.g. "machine learning")
            resumeTokens.Any(t => k.Contains(t, StringComparison.OrdinalIgnoreCase) && t.Length > 4));

        double ratio = (double)matched / requiredTech.Count;
        return (int)Math.Clamp(ratio * 100, 0, 100);
    }

    private static int ComputeTitleScore(string jobTitle, User? profile, Resume? resume)
    {
        // Check target job title on resume first
        var target = resume?.TargetJobTitle ?? string.Empty;

        if (!string.IsNullOrWhiteSpace(target))
            return TitleSimilarity(jobTitle, target);

        // Fall back to user preferred titles
        if (profile?.PreferredTitles is not null)
        {
            try
            {
                var titles = System.Text.Json.JsonSerializer.Deserialize<List<string>>(profile.PreferredTitles);
                if (titles?.Count > 0)
                    return titles.Max(t => TitleSimilarity(jobTitle, t));
            }
            catch { /* ignore malformed JSON */ }
        }

        return 50; // no info → neutral
    }

    private static int TitleSimilarity(string jobTitle, string targetTitle)
    {
        if (string.IsNullOrWhiteSpace(targetTitle)) return 50;
        var jt = jobTitle.ToLowerInvariant();
        var tt = targetTitle.ToLowerInvariant();

        if (jt == tt) return 100;
        if (jt.Contains(tt) || tt.Contains(jt)) return 85;

        // Word overlap
        var jWords = jt.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToHashSet();
        var tWords = tt.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToHashSet();
        int overlap = jWords.Count(w => tWords.Contains(w));
        if (overlap == 0) return 20;
        double ratio = (double)overlap / Math.Max(jWords.Count, tWords.Count);
        return (int)Math.Clamp(ratio * 100, 0, 100);
    }

    private static int ComputePrefsScore(JobDto job, User? profile)
    {
        if (profile is null) return 50;

        var scores = new List<int>();

        // Work model preference
        if (!string.IsNullOrWhiteSpace(job.WorkModel) && profile.WorkModels is not null)
        {
            try
            {
                var prefs = System.Text.Json.JsonSerializer.Deserialize<List<string>>(profile.WorkModels);
                if (prefs?.Count > 0)
                    scores.Add(prefs.Any(p => job.WorkModel.Contains(p, StringComparison.OrdinalIgnoreCase)) ? 100 : 0);
            }
            catch { }
        }

        // Salary range overlap
        if ((job.SalaryMin.HasValue || job.SalaryMax.HasValue) &&
            (profile.SalaryMin.HasValue || profile.SalaryMax.HasValue))
        {
            var jMin = job.SalaryMin ?? 0m;
            var jMax = job.SalaryMax ?? 999_999m;
            var pMin = profile.SalaryMin ?? 0m;
            var pMax = profile.SalaryMax ?? 999_999m;

            bool overlaps = jMax >= pMin && pMax >= jMin;
            scores.Add(overlaps ? 100 : 20);
        }

        return scores.Count > 0 ? (int)scores.Average() : 50;
    }

    private static string GetTier(int score)
    {
        if (score >= 85) return "Strong Match";
        if (score >= 70) return "Good Match";
        if (score >= 50) return "Fair Match";
        return "Weak Match";
    }
}
