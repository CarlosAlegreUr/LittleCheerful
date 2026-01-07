#nullable enable

using System.Collections.Concurrent;
using System.Collections.Immutable;
using System.Runtime.CompilerServices;
using System.Text.Json;
using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Enums;
using LittleCheerful.Contracts.Models;

namespace LittleCheerful.Api.Services;

/// <summary>
/// Provides chat-based learning interactions with the AI tutor.
/// </summary>
public sealed class ChatService : IChatService
{
    private readonly IClaudeCliService _claudeCliService;
    private readonly IFileStateService _fileStateService;
    private readonly ILogger<ChatService> _logger;

    // In-memory store for three-option state (production would use persistent storage)
    private static readonly ConcurrentDictionary<string, ThreeOptionState> ThreeOptionStates = new();

    public ChatService(
        IClaudeCliService claudeCliService,
        IFileStateService fileStateService,
        ILogger<ChatService> logger)
    {
        _claudeCliService = claudeCliService;
        _fileStateService = fileStateService;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<ChatResponse> SendMessageAsync(ChatRequest request, CancellationToken ct)
    {
        _logger.LogInformation("Processing chat message for goal: {Goal}, session: {Session}",
            request.GoalName, request.SessionId);

        var prompt = BuildPrompt(request);
        var response = await _claudeCliService.ExecuteAsync(
            $"-p \"{EscapeForCli(prompt)}\"",
            null,
            null,
            ct);

        if (!response.Success)
        {
            return CreateErrorResponse(request.SessionId, response.ErrorMessage ?? "Unknown error");
        }

        var (messageContent, threeOptionState) = ParseResponse(response.Output, request.SessionId);

        var message = new ChatMessage
        {
            Id = Guid.NewGuid().ToString("N"),
            Type = MessageType.Assistant,
            Content = messageContent,
            Timestamp = DateTimeOffset.UtcNow,
            PendingOptions = threeOptionState
        };

        if (threeOptionState != null)
        {
            ThreeOptionStates[threeOptionState.SessionId] = threeOptionState;
        }

        return new ChatResponse
        {
            Message = message,
            ThreeOptionState = threeOptionState
        };
    }

    /// <inheritdoc />
    public async IAsyncEnumerable<ChatStreamChunk> StreamMessageAsync(
        ChatRequest request,
        [EnumeratorCancellation] CancellationToken ct)
    {
        _logger.LogInformation("Streaming chat message for goal: {Goal}, session: {Session}",
            request.GoalName, request.SessionId);

        var prompt = BuildPrompt(request);
        var progress = new Progress<string>();
        var chunks = new List<string>();

        progress.ProgressChanged += (_, chunk) => chunks.Add(chunk);

        var responseTask = _claudeCliService.ExecuteAsync(
            $"-p \"{EscapeForCli(prompt)}\"",
            null,
            progress,
            ct);

        var lastIndex = 0;
        while (!responseTask.IsCompleted || lastIndex < chunks.Count)
        {
            if (lastIndex < chunks.Count)
            {
                yield return new ChatStreamChunk
                {
                    Content = chunks[lastIndex],
                    IsComplete = false
                };
                lastIndex++;
            }
            else
            {
                await Task.Delay(50, ct);
            }
        }

        await responseTask;

        yield return new ChatStreamChunk
        {
            Content = string.Empty,
            IsComplete = true
        };
    }

    /// <inheritdoc />
    public async Task<ThreeOptionResponse> HandleMistakeOptionAsync(int option, string sessionId, CancellationToken ct)
    {
        _logger.LogInformation("Handling three-option selection: option {Option} for session {Session}",
            option, sessionId);

        if (!ThreeOptionStates.TryGetValue(sessionId, out var state))
        {
            return new ThreeOptionResponse
            {
                Message = new ChatMessage
                {
                    Id = Guid.NewGuid().ToString("N"),
                    Type = MessageType.System,
                    Content = "Session not found. Please try again.",
                    Timestamp = DateTimeOffset.UtcNow
                }
            };
        }

        var prompt = option switch
        {
            1 => "The student wants to try again on their own. Encourage them and let them retry.",
            2 => $"The student wants a hint. This is hint #{state.HintCount + 1}. Provide a helpful hint without giving away the answer.",
            3 => "The student wants the full explanation. Explain the concept completely.",
            _ => throw new ArgumentOutOfRangeException(nameof(option), "Option must be 1, 2, or 3")
        };

        var response = await _claudeCliService.ExecuteAsync(
            $"-p \"{EscapeForCli(prompt)}\"",
            null,
            null,
            ct);

        var message = new ChatMessage
        {
            Id = Guid.NewGuid().ToString("N"),
            Type = MessageType.Assistant,
            Content = response.Success ? response.Output : response.ErrorMessage ?? "Error processing request",
            Timestamp = DateTimeOffset.UtcNow
        };

        ThreeOptionState? nextState = null;

        // If hint was requested, update state for potential follow-up hints
        if (option == 2)
        {
            nextState = state with { HintCount = state.HintCount + 1 };
            ThreeOptionStates[sessionId] = nextState;
        }
        else
        {
            // Remove state for options 1 and 3
            ThreeOptionStates.TryRemove(sessionId, out _);
        }

        return new ThreeOptionResponse
        {
            Message = message,
            NextState = nextState
        };
    }

    private static string BuildPrompt(ChatRequest request)
    {
        var prompt = request.Message;

        if (!string.IsNullOrEmpty(request.ConceptPath))
        {
            prompt = $"[Context: Discussing concept '{request.ConceptPath}' in goal '{request.GoalName}']\n\n{prompt}";
        }
        else
        {
            prompt = $"[Context: Learning goal '{request.GoalName}']\n\n{prompt}";
        }

        return prompt;
    }

    private static string EscapeForCli(string input)
    {
        return input
            .Replace("\\", "\\\\")
            .Replace("\"", "\\\"")
            .Replace("\n", "\\n")
            .Replace("\r", "\\r");
    }

    private static (string content, ThreeOptionState? state) ParseResponse(string output, string sessionId)
    {
        // Check if response contains three-option pattern
        // Pattern: [MISTAKE_DETECTED] followed by acknowledgment and options
        const string mistakeMarker = "[MISTAKE_DETECTED]";

        if (!output.Contains(mistakeMarker))
        {
            return (output.Trim(), null);
        }

        var markerIndex = output.IndexOf(mistakeMarker);
        var beforeMarker = output.Substring(0, markerIndex).Trim();
        var afterMarker = output.Substring(markerIndex + mistakeMarker.Length).Trim();

        // Parse options from the response
        var options = ImmutableArray.Create(
            "I want to try again on my own",
            "Give me a hint",
            "Show me the answer"
        );

        var state = new ThreeOptionState
        {
            SessionId = $"{sessionId}-{Guid.NewGuid():N}",
            Acknowledgment = afterMarker,
            Options = options,
            HintCount = 0
        };

        return (beforeMarker, state);
    }

    private static ChatResponse CreateErrorResponse(string sessionId, string errorMessage)
    {
        return new ChatResponse
        {
            Message = new ChatMessage
            {
                Id = Guid.NewGuid().ToString("N"),
                Type = MessageType.System,
                Content = $"Error: {errorMessage}",
                Timestamp = DateTimeOffset.UtcNow
            }
        };
    }
}
