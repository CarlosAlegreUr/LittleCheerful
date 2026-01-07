#nullable enable

using System.Collections.Immutable;
using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents the complete tree structure for a learning goal.
/// </summary>
public sealed record TreeStructure
{
    /// <summary>
    /// Gets the name of the learning goal.
    /// </summary>
    [JsonPropertyName("goal")]
    public required string Goal { get; init; }

    /// <summary>
    /// Gets the timestamp when the tree was created.
    /// </summary>
    [JsonPropertyName("created")]
    public required DateTimeOffset Created { get; init; }

    /// <summary>
    /// Gets the timestamp when the tree was last updated.
    /// </summary>
    [JsonPropertyName("lastUpdated")]
    public required DateTimeOffset LastUpdated { get; init; }

    /// <summary>
    /// Gets the maximum number of concepts allowed in the tree.
    /// </summary>
    [JsonPropertyName("maxConcepts")]
    public required int MaxConcepts { get; init; }

    /// <summary>
    /// Gets the total number of concepts currently in the tree.
    /// </summary>
    [JsonPropertyName("totalConcepts")]
    public required int TotalConcepts { get; init; }

    /// <summary>
    /// Gets the hierarchical tree of concepts, keyed by concept path.
    /// </summary>
    [JsonPropertyName("tree")]
    public required ImmutableDictionary<string, ConceptNode> Tree { get; init; }
}
