#nullable enable

using System.Collections.Immutable;
using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents the state of a three-option mistake handling flow.
/// When a user makes a mistake, they are presented with three options to proceed.
/// </summary>
public sealed record ThreeOptionState
{
    /// <summary>
    /// Gets the session identifier for this three-option flow.
    /// </summary>
    [JsonPropertyName("sessionId")]
    public required string SessionId { get; init; }

    /// <summary>
    /// Gets the acknowledgment message about the mistake.
    /// </summary>
    [JsonPropertyName("acknowledgment")]
    public required string Acknowledgment { get; init; }

    /// <summary>
    /// Gets the three options presented to the user.
    /// </summary>
    [JsonPropertyName("options")]
    public required ImmutableArray<string> Options { get; init; }

    /// <summary>
    /// Gets the number of hints already given (for option 2 tracking).
    /// </summary>
    [JsonPropertyName("hintCount")]
    public required int HintCount { get; init; }
}
