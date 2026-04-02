namespace SwiftHireApi.Models.DTOs;

public class MatchResultDto
{
    /// <summary>Composite score 0–100.</summary>
    public int Score { get; set; }

    /// <summary>"Strong Match" | "Good Match" | "Fair Match" | "Weak Match"</summary>
    public string Tier { get; set; } = string.Empty;

    /// <summary>Keyword overlap sub-score 0–100.</summary>
    public int KeywordScore { get; set; }

    /// <summary>Tech / skill keyword sub-score 0–100.</summary>
    public int SkillsScore { get; set; }

    /// <summary>Title similarity sub-score 0–100.</summary>
    public int TitleScore { get; set; }

    /// <summary>User preferences alignment sub-score 0–100.</summary>
    public int PrefsScore { get; set; }

    /// <summary>Keywords found in both resume and job description.</summary>
    public List<string> MatchedKeywords { get; set; } = new();

    /// <summary>Important job keywords absent from resume.</summary>
    public List<string> MissingKeywords { get; set; } = new();
}

// ── Request/Response DTOs for the match endpoints ──────────────────────────────

public class ScoreBatchRequestDto
{
    public List<JobDto> Jobs { get; set; } = new();
}

public class ScoreBatchResponseDto
{
    /// <summary>Map of ExternalId → MatchResult.</summary>
    public Dictionary<string, MatchResultDto> Scores { get; set; } = new();
}

public class AnalyzeJobRequestDto
{
    public JobDto Job { get; set; } = new();
}

public class AnalyzeJobResponseDto
{
    public MatchResultDto Match { get; set; } = new();

    /// <summary>Narrative summary from Claude.</summary>
    public string? Summary { get; set; }

    /// <summary>Things the candidate does well for this role.</summary>
    public List<string> Strengths { get; set; } = new();

    /// <summary>Gaps or missing qualifications.</summary>
    public List<string> Gaps { get; set; } = new();

    /// <summary>ATS keyword suggestions to add to the resume.</summary>
    public List<string> AtsKeywords { get; set; } = new();

    /// <summary>Specific resume improvement suggestions.</summary>
    public List<string> ResumeSuggestions { get; set; } = new();

    /// <summary>"High" | "Medium" | "Low"</summary>
    public string? HiringLikelihood { get; set; }
}
