#nullable enable

using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a response from the chat service.
/// </summary>
public sealed record ChatResponse
{
    /// <summary>
    /// Gets the assistant's response message.
    /// </summary>
    [JsonPropertyName("message")]
    public required ChatMessage Message { get; init; }

    /// <summary>
    /// Gets the optional three-option state if the user made a mistake.
    /// </summary>
    [JsonPropertyName("threeOptionState")]
    public ThreeOptionState? ThreeOptionState { get; init; }
}
