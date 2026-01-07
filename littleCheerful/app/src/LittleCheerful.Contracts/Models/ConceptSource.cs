#nullable enable

using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a source of truth for a concept.
/// </summary>
public sealed record ConceptSource
{
    /// <summary>
    /// Gets the title or description of the source.
    /// </summary>
    [JsonPropertyName("title")]
    public required string Title { get; init; }

    /// <summary>
    /// Gets the URL of the source.
    /// </summary>
    [JsonPropertyName("url")]
    public required string Url { get; init; }

    /// <summary>
    /// Gets the type of source (Paper, Textbook, Documentation, Video, Article).
    /// </summary>
    [JsonPropertyName("type")]
    public required string Type { get; init; }

    /// <summary>
    /// Gets the timestamp when the source was fetched.
    /// </summary>
    [JsonPropertyName("fetched")]
    public required DateTimeOffset Fetched { get; init; }

    /// <summary>
    /// Gets the funding information if relevant and available.
    /// </summary>
    [JsonPropertyName("fundedBy")]
    public string? FundedBy { get; init; }
}
