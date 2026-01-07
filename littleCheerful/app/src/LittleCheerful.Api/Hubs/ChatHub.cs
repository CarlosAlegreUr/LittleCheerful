#nullable enable

using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Models;
using Microsoft.AspNetCore.SignalR;

namespace LittleCheerful.Api.Hubs;

/// <summary>
/// SignalR hub for real-time chat functionality.
/// </summary>
public sealed class ChatHub : Hub
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(IChatService chatService, ILogger<ChatHub> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    /// <summary>
    /// Sends a message and streams the response back to the caller.
    /// </summary>
    /// <param name="request">The chat request.</param>
    public async Task SendMessage(ChatRequest request)
    {
        _logger.LogInformation("Hub: SendMessage for session {SessionId}", request.SessionId);

        try
        {
            await foreach (var chunk in _chatService.StreamMessageAsync(request, Context.ConnectionAborted))
            {
                await Clients.Caller.SendAsync("OnMessageChunk", chunk);

                if (chunk.IsComplete)
                {
                    await Clients.Caller.SendAsync("OnMessageComplete", request.SessionId);
                }
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Hub: Message streaming cancelled for session {SessionId}", request.SessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hub: Error streaming message for session {SessionId}", request.SessionId);
            await Clients.Caller.SendAsync("OnError", ex.Message);
        }
    }

    /// <summary>
    /// Handles a three-option selection.
    /// </summary>
    /// <param name="sessionId">The session ID for the three-option flow.</param>
    /// <param name="option">The selected option (1, 2, or 3).</param>
    public async Task SelectOption(string sessionId, int option)
    {
        _logger.LogInformation("Hub: SelectOption {Option} for session {SessionId}", option, sessionId);

        try
        {
            var response = await _chatService.HandleMistakeOptionAsync(option, sessionId, Context.ConnectionAborted);

            // Stream the response chunks
            await Clients.Caller.SendAsync("OnMessageChunk", new ChatStreamChunk
            {
                Content = response.Message.Content,
                IsComplete = true
            });

            if (response.NextState != null)
            {
                await Clients.Caller.SendAsync("OnThreeOptionPrompt", response.NextState);
            }

            await Clients.Caller.SendAsync("OnMessageComplete", sessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hub: Error handling option for session {SessionId}", sessionId);
            await Clients.Caller.SendAsync("OnError", ex.Message);
        }
    }

    /// <summary>
    /// Called when a client connects.
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Called when a client disconnects.
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}
