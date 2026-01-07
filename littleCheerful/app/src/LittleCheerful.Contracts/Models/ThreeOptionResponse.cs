#nullable enable

using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a response after the user selects a three-option choice.
/// </summary>
public sealed record ThreeOptionResponse
{
    /// <summary>
    /// Gets the response message based on the selected option.
    /// </summary>
    [JsonPropertyName("message")]
    public required ChatMessage Message { get; init; }

    /// <summary>
    /// Gets the next three-option state if the flow continues (e.g., another hint requested).
    /// </summary>
    [JsonPropertyName("nextState")]
    public ThreeOptionState? NextState { get; init; }
}
