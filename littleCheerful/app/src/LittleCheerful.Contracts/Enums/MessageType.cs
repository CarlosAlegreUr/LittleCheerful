#nullable enable

namespace LittleCheerful.Contracts.Enums;

/// <summary>
/// Represents the type of message in a chat conversation.
/// </summary>
public enum MessageType
{
    /// <summary>
    /// A message from the user.
    /// </summary>
    User = 0,

    /// <summary>
    /// A message from the AI assistant.
    /// </summary>
    Assistant = 1,

    /// <summary>
    /// A system message (instructions, notifications, etc.).
    /// </summary>
    System = 2
}
