#nullable enable

using System.Text.Json.Serialization;
using LittleCheerful.Contracts.Enums;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a single message in a chat conversation.
/// </summary>
public sealed record ChatMessage
{
    /// <summary>
    /// Gets the unique identifier of the message.
    /// </summary>
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    /// <summary>
    /// Gets the type of message (User, Assistant, or System).
    /// </summary>
    [JsonPropertyName("type")]
    public required MessageType Type { get; init; }

    /// <summary>
    /// Gets the content of the message.
    /// </summary>
    [JsonPropertyName("content")]
    public required string Content { get; init; }

    /// <summary>
    /// Gets the timestamp when the message was created.
    /// </summary>
    [JsonPropertyName("timestamp")]
    public required DateTimeOffset Timestamp { get; init; }

    /// <summary>
    /// Gets the pending three-option state, if any, attached to this message.
    /// </summary>
    [JsonPropertyName("pendingOptions")]
    public ThreeOptionState? PendingOptions { get; init; }
}
