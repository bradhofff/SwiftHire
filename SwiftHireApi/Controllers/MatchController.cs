using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwiftHireApi.Data;
using SwiftHireApi.Models.DTOs;
using SwiftHireApi.Services;

namespace SwiftHireApi.Controllers;

[ApiController]
[Route("api/match")]
public class MatchController : ControllerBase
{
    private readonly SwiftHireDbContext _db;
    private readonly MatchScoringService _scorer;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;
    private readonly ILogger<MatchController> _logger;

    private const int HardcodedUserId = 1;

    public MatchController(
        SwiftHireDbContext db,
        MatchScoringService scorer,
        IHttpClientFactory httpClientFactory,
        IConfiguration config,
        ILogger<MatchController> logger)
    {
        _db = db;
        _scorer = scorer;
        _httpClientFactory = httpClientFactory;
        _config = config;
        _logger = logger;
    }

    // ── POST /api/match/score-batch ───────────────────────────────────────────
    /// <summary>
    /// Fast keyword scoring for a batch of jobs. No AI cost.
    /// Returns a map of ExternalId → MatchResult.
    /// </summary>
    [HttpPost("score-batch")]
    public async Task<IActionResult> ScoreBatch([FromBody] ScoreBatchRequestDto body)
    {
        var profile = await _db.Users
            .FirstOrDefaultAsync(p => p.UserId == HardcodedUserId);

        var primaryResume = await _db.Resumes
            .Where(r => r.UserId == HardcodedUserId && r.IsPrimary)
            .OrderByDescending(r => r.UploadedAt)
            .FirstOrDefaultAsync();

        var scores = _scorer.ScoreBatch(body.Jobs, profile, primaryResume);
        return Ok(new ScoreBatchResponseDto { Scores = scores });
    }

    // ── POST /api/match/analyze ───────────────────────────────────────────────
    /// <summary>
    /// Deep Claude AI analysis for a single job. Uses Anthropic API.
    /// </summary>
    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromBody] AnalyzeJobRequestDto body)
    {
        var profile = await _db.Users
            .FirstOrDefaultAsync(p => p.UserId == HardcodedUserId);

        var primaryResume = await _db.Resumes
            .Where(r => r.UserId == HardcodedUserId && r.IsPrimary)
            .OrderByDescending(r => r.UploadedAt)
            .FirstOrDefaultAsync();

        // Always run fast scorer first
        var match = _scorer.ScoreJob(body.Job, profile, primaryResume);

        var resumeText = primaryResume?.ResumeText ?? profile?.ResumeText ?? string.Empty;

        // Only call Claude if we have both a resume and an Anthropic key
        var apiKey = _config["Anthropic:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(resumeText))
        {
            return Ok(new AnalyzeJobResponseDto
            {
                Match = match,
                Summary = "Upload a resume to get AI-powered analysis.",
                Strengths = new(),
                Gaps = match.MissingKeywords.Take(4).ToList(),
                AtsKeywords = match.MissingKeywords,
                ResumeSuggestions = new(),
                HiringLikelihood = ScoreToLikelihood(match.Score),
            });
        }

        // ── Call Claude ────────────────────────────────────────────────────────
        var analysisResponse = await CallClaudeAsync(apiKey, body.Job, resumeText, match);
        return Ok(analysisResponse);
    }

    // ── Private: Claude API call ──────────────────────────────────────────────

    private async Task<AnalyzeJobResponseDto> CallClaudeAsync(
        string apiKey,
        JobDto job,
        string resumeText,
        MatchResultDto match)
    {
        var prompt = BuildPrompt(job, resumeText, match);

        var requestBody = new
        {
            model = "claude-sonnet-4-20250514",
            max_tokens = 1024,
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);

        var http = _httpClientFactory.CreateClient("Anthropic");
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.anthropic.com/v1/messages");
        request.Headers.Add("x-api-key", apiKey);
        request.Headers.Add("anthropic-version", "2023-06-01");
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        HttpResponseMessage response;
        try
        {
            response = await http.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Claude API call failed");
            return FallbackResponse(match);
        }

        var body = await response.Content.ReadAsStringAsync();

        try
        {
            return ParseClaudeResponse(body, match);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse Claude response: {Body}", body);
            return FallbackResponse(match);
        }
    }

    private static string BuildPrompt(JobDto job, string resumeText, MatchResultDto match)
    {
        var truncatedResume = resumeText.Length > 3000
            ? resumeText[..3000] + "\n[truncated]"
            : resumeText;

        var truncatedDesc = job.Description?.Length > 2000
            ? job.Description[..2000] + "\n[truncated]"
            : job.Description ?? "(no description)";

        var jsonShape =
            "{\n" +
            "  \"summary\": \"2-3 sentence honest assessment of the candidate's fit\",\n" +
            "  \"strengths\": [\"strength 1\", \"strength 2\", \"strength 3\"],\n" +
            "  \"gaps\": [\"gap 1\", \"gap 2\", \"gap 3\"],\n" +
            "  \"atsKeywords\": [\"keyword1\", \"keyword2\", \"keyword3\", \"keyword4\", \"keyword5\"],\n" +
            "  \"resumeSuggestions\": [\"suggestion 1\", \"suggestion 2\", \"suggestion 3\"],\n" +
            "  \"hiringLikelihood\": \"High|Medium|Low\"\n" +
            "}";

        return
            $"You are a professional resume and job fit analyst. Analyze the match between this resume and job posting.\n\n" +
            $"JOB TITLE: {job.Title}\n" +
            $"COMPANY: {job.CompanyName}\n" +
            $"JOB DESCRIPTION:\n{truncatedDesc}\n\n" +
            $"RESUME TEXT:\n{truncatedResume}\n\n" +
            $"KEYWORD MATCH SCORE: {match.Score}/100\n" +
            $"MATCHED SKILLS: {string.Join(", ", match.MatchedKeywords.Take(10))}\n" +
            $"MISSING SKILLS: {string.Join(", ", match.MissingKeywords.Take(10))}\n\n" +
            $"Respond with ONLY valid JSON matching this exact structure (no markdown, no explanation):\n" +
            jsonShape;
    }

    private static AnalyzeJobResponseDto ParseClaudeResponse(string responseBody, MatchResultDto match)
    {
        using var doc = JsonDocument.Parse(responseBody);
        var content = doc.RootElement
            .GetProperty("content")[0]
            .GetProperty("text")
            .GetString() ?? "{}";

        using var parsed = JsonDocument.Parse(content);
        var root = parsed.RootElement;

        static List<string> GetList(JsonElement el, string key)
        {
            if (!el.TryGetProperty(key, out var arr) || arr.ValueKind != JsonValueKind.Array)
                return new();
            return arr.EnumerateArray()
                .Select(x => x.GetString() ?? string.Empty)
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .ToList();
        }

        return new AnalyzeJobResponseDto
        {
            Match = match,
            Summary = root.TryGetProperty("summary", out var s) ? s.GetString() : null,
            Strengths = GetList(root, "strengths"),
            Gaps = GetList(root, "gaps"),
            AtsKeywords = GetList(root, "atsKeywords"),
            ResumeSuggestions = GetList(root, "resumeSuggestions"),
            HiringLikelihood = root.TryGetProperty("hiringLikelihood", out var hl) ? hl.GetString() : null,
        };
    }

    private static AnalyzeJobResponseDto FallbackResponse(MatchResultDto match) => new()
    {
        Match = match,
        Summary = "AI analysis temporarily unavailable. Showing keyword-based score.",
        Strengths = match.MatchedKeywords.Take(3).Select(k => $"Experience with {k}").ToList(),
        Gaps = match.MissingKeywords.Take(3).Select(k => $"Consider adding {k} to your resume").ToList(),
        AtsKeywords = match.MissingKeywords,
        ResumeSuggestions = new(),
        HiringLikelihood = ScoreToLikelihood(match.Score),
    };

    private static string ScoreToLikelihood(int score)
    {
        if (score >= 75) return "High";
        if (score >= 50) return "Medium";
        return "Low";
    }
}
