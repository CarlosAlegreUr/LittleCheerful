#nullable enable

using System.Collections.ObjectModel;
using System.Text;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LittleCheerful.Contracts.Enums;
using LittleCheerful.Contracts.Models;
using LittleCheerful.Maui.Services;

namespace LittleCheerful.Maui.ViewModels;

/// <summary>
/// ViewModel for the Session page (chat with AI tutor).
/// </summary>
[QueryProperty(nameof(GoalName), "goalName")]
[QueryProperty(nameof(ConceptPath), "conceptPath")]
public partial class SessionViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;
    private readonly INavigationService _navigation;

    private string _sessionId = Guid.NewGuid().ToString();
    private readonly StringBuilder _streamingContent = new();

    [ObservableProperty]
    private string title = "Learning Session";

    [ObservableProperty]
    private string? goalName;

    [ObservableProperty]
    private string? conceptPath;

    [ObservableProperty]
    private ObservableCollection<ChatMessageViewModel> messages = new();

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(SendMessageCommand))]
    private string currentMessage = string.Empty;

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private bool isStreaming;

    [ObservableProperty]
    private bool showThreeOptions;

    [ObservableProperty]
    private ThreeOptionState? threeOptionState;

    [ObservableProperty]
    private string? errorMessage;

    [ObservableProperty]
    private string? streamingText;

    public SessionViewModel(ApiClient apiClient, INavigationService navigation)
    {
        _apiClient = apiClient;
        _navigation = navigation;

        // Subscribe to SignalR events
        _apiClient.OnMessageChunk += HandleMessageChunk;
        _apiClient.OnMessageComplete += HandleMessageComplete;
        _apiClient.OnThreeOptionPrompt += HandleThreeOptionPrompt;
    }

    /// <summary>
    /// Called when the page appears.
    /// </summary>
    [RelayCommand]
    private async Task AppearingAsync()
    {
        try
        {
            // Connect to SignalR
            await _apiClient.ConnectAsync();

            // Add welcome message
            if (Messages.Count == 0)
            {
                Messages.Add(new ChatMessageViewModel(new ChatMessage
                {
                    Id = Guid.NewGuid().ToString(),
                    Type = MessageType.System,
                    Content = $"Welcome! Let's learn about {GoalName ?? "this topic"}.",
                    Timestamp = DateTimeOffset.Now
                }));
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Unable to connect: {ex.Message}";
        }
    }

    private bool CanSendMessage => !string.IsNullOrWhiteSpace(CurrentMessage) && !IsLoading && !IsStreaming;

    /// <summary>
    /// Sends a message to the AI tutor.
    /// </summary>
    [RelayCommand(CanExecute = nameof(CanSendMessage))]
    private async Task SendMessageAsync()
    {
        if (string.IsNullOrWhiteSpace(GoalName))
        {
            ErrorMessage = "No goal specified";
            return;
        }

        var userMessage = CurrentMessage.Trim();
        CurrentMessage = string.Empty;

        // Add user message to chat
        Messages.Add(new ChatMessageViewModel(new ChatMessage
        {
            Id = Guid.NewGuid().ToString(),
            Type = MessageType.User,
            Content = userMessage,
            Timestamp = DateTimeOffset.Now
        }));

        IsLoading = true;
        ErrorMessage = null;

        try
        {
            var request = new ChatRequest
            {
                GoalName = GoalName,
                ConceptPath = ConceptPath,
                Message = userMessage,
                SessionId = _sessionId
            };

            // Try streaming first
            IsStreaming = true;
            _streamingContent.Clear();

            await foreach (var chunk in _apiClient.StreamMessageAsync(request))
            {
                _streamingContent.Append(chunk.Content);
                StreamingText = _streamingContent.ToString();

                if (chunk.IsComplete)
                    break;
            }

            // Add assistant message
            if (_streamingContent.Length > 0)
            {
                Messages.Add(new ChatMessageViewModel(new ChatMessage
                {
                    Id = Guid.NewGuid().ToString(),
                    Type = MessageType.Assistant,
                    Content = _streamingContent.ToString(),
                    Timestamp = DateTimeOffset.Now
                }));
            }

            StreamingText = null;
            IsStreaming = false;
        }
        catch (HttpRequestException ex)
        {
            ErrorMessage = $"Unable to send message: {ex.Message}";
            IsStreaming = false;
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error: {ex.Message}";
            IsStreaming = false;
        }
        finally
        {
            IsLoading = false;
        }
    }

    private void HandleMessageChunk(string chunk)
    {
        MainThread.BeginInvokeOnMainThread(() =>
        {
            _streamingContent.Append(chunk);
            StreamingText = _streamingContent.ToString();
        });
    }

    private void HandleMessageComplete(ChatMessage message)
    {
        MainThread.BeginInvokeOnMainThread(() =>
        {
            IsStreaming = false;
            StreamingText = null;
            Messages.Add(new ChatMessageViewModel(message));

            if (message.PendingOptions != null)
            {
                ThreeOptionState = message.PendingOptions;
                ShowThreeOptions = true;
            }
        });
    }

    private void HandleThreeOptionPrompt(ThreeOptionState state)
    {
        MainThread.BeginInvokeOnMainThread(() =>
        {
            ThreeOptionState = state;
            ShowThreeOptions = true;
        });
    }

    /// <summary>
    /// Selects option 1: "I want to try again on my own"
    /// </summary>
    [RelayCommand]
    private async Task ThinkMoreAsync()
    {
        await SelectOptionAsync(1);
    }

    /// <summary>
    /// Selects option 2: "Give me a hint"
    /// </summary>
    [RelayCommand]
    private async Task GetHintAsync()
    {
        await SelectOptionAsync(2);
    }

    /// <summary>
    /// Selects option 3: "Just explain it to me"
    /// </summary>
    [RelayCommand]
    private async Task HearExplanationAsync()
    {
        await SelectOptionAsync(3);
    }

    private async Task SelectOptionAsync(int option)
    {
        if (ThreeOptionState == null)
            return;

        IsLoading = true;
        ErrorMessage = null;

        try
        {
            var response = await _apiClient.HandleMistakeOptionAsync(option, ThreeOptionState.SessionId);

            Messages.Add(new ChatMessageViewModel(response.Message));

            if (response.NextState != null)
            {
                ThreeOptionState = response.NextState;
                ShowThreeOptions = true;
            }
            else
            {
                ShowThreeOptions = false;
                ThreeOptionState = null;
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error selecting option: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    /// <summary>
    /// Navigates back to the tree view.
    /// </summary>
    [RelayCommand]
    private async Task GoBackAsync()
    {
        await _navigation.GoBackAsync();
    }
}

/// <summary>
/// ViewModel wrapper for ChatMessage for display.
/// </summary>
public class ChatMessageViewModel
{
    public ChatMessage Message { get; }

    public string Content => Message.Content;
    public bool IsUser => Message.Type == MessageType.User;
    public bool IsAssistant => Message.Type == MessageType.Assistant;
    public bool IsSystem => Message.Type == MessageType.System;
    public string TimeDisplay => Message.Timestamp.LocalDateTime.ToString("HH:mm");

    public ChatMessageViewModel(ChatMessage message)
    {
        Message = message;
    }
}
