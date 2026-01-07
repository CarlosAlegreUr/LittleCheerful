#nullable enable

using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a request to send a chat message.
/// </summary>
public sealed record ChatRequest
{
    /// <summary>
    /// Gets the name of the learning goal for context.
    /// </summary>
    [JsonPropertyName("goalName")]
    public required string GoalName { get; init; }

    /// <summary>
    /// Gets the optional concept path for focused discussion.
    /// </summary>
    [JsonPropertyName("conceptPath")]
    public string? ConceptPath { get; init; }

    /// <summary>
    /// Gets the user's message content.
    /// </summary>
    [JsonPropertyName("message")]
    public required string Message { get; init; }

    /// <summary>
    /// Gets the session identifier for conversation continuity.
    /// </summary>
    [JsonPropertyName("sessionId")]
    public required string SessionId { get; init; }
}
