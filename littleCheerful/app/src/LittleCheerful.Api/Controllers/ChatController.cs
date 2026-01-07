#nullable enable

using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Models;
using Microsoft.AspNetCore.Mvc;

namespace LittleCheerful.Api.Controllers;

/// <summary>
/// Controller for chat interactions with the AI tutor.
/// </summary>
[ApiController]
[Route("api/chat")]
public sealed class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IChatService chatService, ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    /// <summary>
    /// Sends a message to the AI tutor.
    /// </summary>
    /// <param name="request">The chat request.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The chat response.</returns>
    [HttpPost("message")]
    [ProducesResponseType(typeof(ChatResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ChatResponse>> SendMessage(
        [FromBody] ChatRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest("Message cannot be empty");
        }

        if (string.IsNullOrWhiteSpace(request.GoalName))
        {
            return BadRequest("Goal name is required");
        }

        _logger.LogInformation("Received chat message for goal: {Goal}", request.GoalName);

        var response = await _chatService.SendMessageAsync(request, ct);
        return Ok(response);
    }

    /// <summary>
    /// Handles a three-option selection for mistake handling.
    /// </summary>
    /// <param name="sessionId">The session ID for the three-option flow.</param>
    /// <param name="option">The selected option (1, 2, or 3).</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The response based on the selected option.</returns>
    [HttpPost("option/{sessionId}")]
    [ProducesResponseType(typeof(ThreeOptionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ThreeOptionResponse>> HandleOption(
        string sessionId,
        [FromQuery] int option,
        CancellationToken ct)
    {
        if (option < 1 || option > 3)
        {
            return BadRequest("Option must be 1, 2, or 3");
        }

        _logger.LogInformation("Handling option {Option} for session: {SessionId}", option, sessionId);

        var response = await _chatService.HandleMistakeOptionAsync(option, sessionId, ct);
        return Ok(response);
    }

    /// <summary>
    /// Gets chat history for a goal (placeholder - not persisted in current implementation).
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>Empty list (chat history is not persisted in this implementation).</returns>
    [HttpGet("history/{goalName}")]
    [ProducesResponseType(typeof(IEnumerable<ChatMessage>), StatusCodes.Status200OK)]
    public Task<ActionResult<IEnumerable<ChatMessage>>> GetHistory(
        string goalName,
        CancellationToken ct)
    {
        _logger.LogInformation("Getting chat history for goal: {Goal}", goalName);

        // Chat history is not persisted in this implementation
        // Return empty list
        return Task.FromResult<ActionResult<IEnumerable<ChatMessage>>>(
            Ok(Array.Empty<ChatMessage>()));
    }
}
