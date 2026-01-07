#nullable enable

using System.Text.Json;
using LittleCheerful.Api.Configuration;
using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Models;
using Microsoft.Extensions.Options;

namespace LittleCheerful.Api.Services;

/// <summary>
/// Manages file-based state persistence for learning data.
/// </summary>
public sealed class FileStateService : IFileStateService
{
    private readonly LittleCheerfulOptions _options;
    private readonly ILogger<FileStateService> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public FileStateService(
        IOptions<LittleCheerfulOptions> options,
        ILogger<FileStateService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<TreeStructure?> ReadTreeAsync(string goalName, CancellationToken ct)
    {
        var path = GetTreePath(goalName);

        if (!File.Exists(path))
        {
            _logger.LogDebug("Tree file not found: {Path}", path);
            return null;
        }

        try
        {
            var json = await File.ReadAllTextAsync(path, ct);
            return JsonSerializer.Deserialize<TreeStructure>(json, JsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to read tree from {Path}", path);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task WriteTreeAsync(string goalName, TreeStructure tree, CancellationToken ct)
    {
        var path = GetTreePath(goalName);
        var directory = Path.GetDirectoryName(path);

        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        try
        {
            var json = JsonSerializer.Serialize(tree, JsonOptions);
            await File.WriteAllTextAsync(path, json, ct);
            _logger.LogDebug("Tree written to {Path}", path);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to write tree to {Path}", path);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<LearningProfile?> ReadProfileAsync(CancellationToken ct)
    {
        var path = GetProfilePath();

        if (!File.Exists(path))
        {
            _logger.LogDebug("Profile file not found: {Path}", path);
            return null;
        }

        try
        {
            var markdown = await File.ReadAllTextAsync(path, ct);
            return ParseProfileFromMarkdown(markdown);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to read profile from {Path}", path);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task WriteProfileAsync(LearningProfile profile, CancellationToken ct)
    {
        var path = GetProfilePath();
        var directory = Path.GetDirectoryName(path);

        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        try
        {
            var markdown = ConvertProfileToMarkdown(profile);
            await File.WriteAllTextAsync(path, markdown, ct);
            _logger.LogDebug("Profile written to {Path}", path);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to write profile to {Path}", path);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<string?> ReadConceptAsync(string goalName, string conceptPath, CancellationToken ct)
    {
        var path = GetConceptPath(goalName, conceptPath);

        if (!File.Exists(path))
        {
            _logger.LogDebug("Concept file not found: {Path}", path);
            return null;
        }

        try
        {
            return await File.ReadAllTextAsync(path, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to read concept from {Path}", path);
            throw;
        }
    }

    private string GetTreePath(string goalName)
    {
        return Path.Combine(_options.ClaudeBasePath, ".claude", "study-goals", goalName, "tree.json");
    }

    private string GetProfilePath()
    {
        return Path.Combine(_options.ClaudeBasePath, ".claude", "learning-profile.md");
    }

    private string GetConceptPath(string goalName, string conceptPath)
    {
        return Path.Combine(_options.ClaudeBasePath, ".claude", "study-goals", goalName, conceptPath, "concept.md");
    }

    private static LearningProfile ParseProfileFromMarkdown(string markdown)
    {
        // Parse markdown format to extract profile properties
        // Format expected:
        // # Learning Profile
        // - Tone: Nice
        // - Motivation: PositiveReinforcement
        // - Source Depth: 2
        // - Terminology: Casual
        // - Examples: Analogies
        // - Language: English
        // - Created: 2026-01-06T10:00:00Z
        // - Last Updated: 2026-01-06T10:00:00Z

        var lines = markdown.Split('\n');
        var tone = Contracts.Enums.TeachingTone.Balanced;
        string? customTone = null;
        var motivation = Contracts.Enums.MotivationStyle.Balanced;
        var sourceDepth = 2;
        var terminology = Contracts.Enums.TerminologyLevel.Adaptive;
        var examples = Contracts.Enums.ExamplePreference.Both;
        var language = "English";
        var created = DateTimeOffset.UtcNow;
        DateTimeOffset? lastUpdated = null;

        foreach (var line in lines)
        {
            if (line.StartsWith("- Tone:"))
            {
                var value = line.Substring("- Tone:".Length).Trim();
                Enum.TryParse(value, true, out tone);
            }
            else if (line.StartsWith("- Custom Tone:"))
            {
                customTone = line.Substring("- Custom Tone:".Length).Trim();
            }
            else if (line.StartsWith("- Motivation:"))
            {
                var value = line.Substring("- Motivation:".Length).Trim();
                Enum.TryParse(value, true, out motivation);
            }
            else if (line.StartsWith("- Source Depth:"))
            {
                var value = line.Substring("- Source Depth:".Length).Trim();
                int.TryParse(value, out sourceDepth);
            }
            else if (line.StartsWith("- Terminology:"))
            {
                var value = line.Substring("- Terminology:".Length).Trim();
                Enum.TryParse(value, true, out terminology);
            }
            else if (line.StartsWith("- Examples:"))
            {
                var value = line.Substring("- Examples:".Length).Trim();
                Enum.TryParse(value, true, out examples);
            }
            else if (line.StartsWith("- Language:"))
            {
                language = line.Substring("- Language:".Length).Trim();
            }
            else if (line.StartsWith("- Created:"))
            {
                var value = line.Substring("- Created:".Length).Trim();
                if (DateTimeOffset.TryParse(value, out var parsedDate))
                {
                    created = parsedDate;
                }
            }
            else if (line.StartsWith("- Last Updated:"))
            {
                var value = line.Substring("- Last Updated:".Length).Trim();
                if (DateTimeOffset.TryParse(value, out var parsedDate))
                {
                    lastUpdated = parsedDate;
                }
            }
        }

        return new LearningProfile
        {
            Tone = tone,
            CustomToneDescription = customTone,
            Motivation = motivation,
            SourceDepth = sourceDepth,
            Terminology = terminology,
            Examples = examples,
            PreferredLanguage = language,
            Created = created,
            LastUpdated = lastUpdated
        };
    }

    private static string ConvertProfileToMarkdown(LearningProfile profile)
    {
        var sb = new System.Text.StringBuilder();
        sb.AppendLine("# Learning Profile");
        sb.AppendLine();
        sb.AppendLine($"- Tone: {profile.Tone}");
        if (!string.IsNullOrEmpty(profile.CustomToneDescription))
        {
            sb.AppendLine($"- Custom Tone: {profile.CustomToneDescription}");
        }
        sb.AppendLine($"- Motivation: {profile.Motivation}");
        sb.AppendLine($"- Source Depth: {profile.SourceDepth}");
        sb.AppendLine($"- Terminology: {profile.Terminology}");
        sb.AppendLine($"- Examples: {profile.Examples}");
        sb.AppendLine($"- Language: {profile.PreferredLanguage}");
        sb.AppendLine($"- Created: {profile.Created:O}");
        if (profile.LastUpdated.HasValue)
        {
            sb.AppendLine($"- Last Updated: {profile.LastUpdated.Value:O}");
        }

        return sb.ToString();
    }
}
