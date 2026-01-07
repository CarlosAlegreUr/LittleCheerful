#nullable enable

using System.Collections.Immutable;
using System.Text.Json.Serialization;
using LittleCheerful.Contracts.Enums;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a single concept node in the learning tree.
/// </summary>
public sealed record ConceptNode
{
    /// <summary>
    /// Gets the display name of the concept.
    /// </summary>
    [JsonPropertyName("name")]
    public required string Name { get; init; }

    /// <summary>
    /// Gets the learning status of the concept.
    /// </summary>
    [JsonPropertyName("status")]
    public required ConceptStatus Status { get; init; }

    /// <summary>
    /// Gets the mastery tags applied to this concept.
    /// </summary>
    [JsonPropertyName("tags")]
    public required ConceptTag Tags { get; init; }

    /// <summary>
    /// Gets the timestamp when the concept was last reviewed.
    /// </summary>
    [JsonPropertyName("lastReviewed")]
    public DateTimeOffset? LastReviewed { get; init; }

    /// <summary>
    /// Gets the path to the parent concept, if any.
    /// </summary>
    [JsonPropertyName("parent")]
    public string? Parent { get; init; }

    /// <summary>
    /// Gets the paths to child concepts.
    /// </summary>
    [JsonPropertyName("children")]
    public required ImmutableArray<string> Children { get; init; }

    /// <summary>
    /// Gets the brief overview of the concept.
    /// </summary>
    [JsonPropertyName("overview")]
    public string? Overview { get; init; }

    /// <summary>
    /// Gets the full explanation of the concept.
    /// </summary>
    [JsonPropertyName("explanation")]
    public string? Explanation { get; init; }

    /// <summary>
    /// Gets the sources used for this concept.
    /// </summary>
    [JsonPropertyName("sources")]
    public required ImmutableArray<ConceptSource> Sources { get; init; }
}
