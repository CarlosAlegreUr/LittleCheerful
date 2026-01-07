#nullable enable

using System.Text.Json.Serialization;
using LittleCheerful.Contracts.Enums;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a user's learning profile with their teaching preferences.
/// </summary>
public sealed record LearningProfile
{
    /// <summary>
    /// Gets the preferred teaching tone.
    /// </summary>
    [JsonPropertyName("tone")]
    public required TeachingTone Tone { get; init; }

    /// <summary>
    /// Gets the custom tone description when Tone is Other.
    /// </summary>
    [JsonPropertyName("customToneDescription")]
    public string? CustomToneDescription { get; init; }

    /// <summary>
    /// Gets the preferred motivation style.
    /// </summary>
    [JsonPropertyName("motivation")]
    public required MotivationStyle Motivation { get; init; }

    /// <summary>
    /// Gets the source depth preference (1-4).
    /// </summary>
    [JsonPropertyName("sourceDepth")]
    public required int SourceDepth { get; init; }

    /// <summary>
    /// Gets the terminology level preference.
    /// </summary>
    [JsonPropertyName("terminology")]
    public required TerminologyLevel Terminology { get; init; }

    /// <summary>
    /// Gets the example preference.
    /// </summary>
    [JsonPropertyName("examples")]
    public required ExamplePreference Examples { get; init; }

    /// <summary>
    /// Gets the preferred language for learning (e.g., "English", "Spanish").
    /// </summary>
    [JsonPropertyName("preferredLanguage")]
    public required string PreferredLanguage { get; init; }

    /// <summary>
    /// Gets the timestamp when the profile was created.
    /// </summary>
    [JsonPropertyName("created")]
    public required DateTimeOffset Created { get; init; }

    /// <summary>
    /// Gets the timestamp when the profile was last updated.
    /// </summary>
    [JsonPropertyName("lastUpdated")]
    public DateTimeOffset? LastUpdated { get; init; }
}
