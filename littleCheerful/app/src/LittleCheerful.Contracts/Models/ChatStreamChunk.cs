#nullable enable

using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a chunk of streamed chat response.
/// </summary>
public sealed record ChatStreamChunk
{
    /// <summary>
    /// Gets the content fragment of this chunk.
    /// </summary>
    [JsonPropertyName("content")]
    public required string Content { get; init; }

    /// <summary>
    /// Gets a value indicating whether this is the final chunk.
    /// </summary>
    [JsonPropertyName("isComplete")]
    public required bool IsComplete { get; init; }
}
