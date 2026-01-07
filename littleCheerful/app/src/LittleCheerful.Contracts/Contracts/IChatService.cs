#nullable enable

using LittleCheerful.Contracts.Models;

namespace LittleCheerful.Contracts.Contracts;

/// <summary>
/// Provides chat-based learning interactions with the AI tutor.
/// </summary>
public interface IChatService
{
    /// <summary>
    /// Sends a message to the AI tutor and receives a complete response.
    /// </summary>
    /// <param name="request">The chat request containing the message and context.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The complete chat response from the AI tutor.</returns>
    Task<ChatResponse> SendMessageAsync(ChatRequest request, CancellationToken ct);

    /// <summary>
    /// Sends a message to the AI tutor and streams the response in chunks.
    /// </summary>
    /// <param name="request">The chat request containing the message and context.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>An async enumerable of response chunks.</returns>
    IAsyncEnumerable<ChatStreamChunk> StreamMessageAsync(ChatRequest request, CancellationToken ct);

    /// <summary>
    /// Handles the user's selection of a three-option response when a mistake is detected.
    /// </summary>
    /// <param name="option">The selected option (1, 2, or 3).</param>
    /// <param name="sessionId">The session identifier for the three-option flow.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The response based on the selected option.</returns>
    /// <remarks>
    /// Option 1: User wants to try again on their own.
    /// Option 2: User wants a hint (can be requested multiple times).
    /// Option 3: User wants the full explanation.
    /// </remarks>
    Task<ThreeOptionResponse> HandleMistakeOptionAsync(int option, string sessionId, CancellationToken ct);
}
