#nullable enable

using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text.Json;
using LittleCheerful.Contracts.Models;
using Microsoft.AspNetCore.SignalR.Client;

namespace LittleCheerful.Maui.Services;

/// <summary>
/// HTTP and SignalR client for communicating with the LittleCheerful API.
/// </summary>
public sealed class ApiClient : IDisposable
{
    private readonly HttpClient _http;
    private readonly HubConnection _hub;
    private readonly string _baseUrl;
    private bool _disposed;

    /// <summary>
    /// Fired when a message chunk is received during streaming.
    /// </summary>
    public event Action<string>? OnMessageChunk;

    /// <summary>
    /// Fired when a complete message is received.
    /// </summary>
    public event Action<ChatMessage>? OnMessageComplete;

    /// <summary>
    /// Fired when a three-option prompt is triggered.
    /// </summary>
    public event Action<ThreeOptionState>? OnThreeOptionPrompt;

    /// <summary>
    /// Fired when operation progress is updated.
    /// </summary>
    public event Action<OperationStatus>? OnOperationProgress;

    /// <summary>
    /// Fired when the SignalR connection state changes.
    /// </summary>
    public event Action<HubConnectionState>? OnConnectionStateChanged;

    /// <summary>
    /// Gets the current SignalR connection state.
    /// </summary>
    public HubConnectionState ConnectionState => _hub.State;

    /// <summary>
    /// Creates a new ApiClient instance.
    /// </summary>
    /// <param name="baseUrl">The base URL of the API (default: https://localhost:5001).</param>
    public ApiClient(string baseUrl = "https://localhost:5001")
    {
        _baseUrl = baseUrl.TrimEnd('/');

        var handler = new HttpClientHandler
        {
            // For development - accept self-signed certs
            ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
        };

        _http = new HttpClient(handler)
        {
            BaseAddress = new Uri(_baseUrl),
            Timeout = TimeSpan.FromMinutes(5)
        };

        _hub = new HubConnectionBuilder()
            .WithUrl($"{_baseUrl}/learning-hub", options =>
            {
                // For development - accept self-signed certs
                options.HttpMessageHandlerFactory = _ => handler;
            })
            .WithAutomaticReconnect()
            .Build();

        SetupHubHandlers();
    }

    private void SetupHubHandlers()
    {
        _hub.On<string>("ReceiveMessageChunk", chunk =>
        {
            OnMessageChunk?.Invoke(chunk);
        });

        _hub.On<ChatMessage>("ReceiveMessageComplete", message =>
        {
            OnMessageComplete?.Invoke(message);
        });

        _hub.On<ThreeOptionState>("ReceiveThreeOptionPrompt", state =>
        {
            OnThreeOptionPrompt?.Invoke(state);
        });

        _hub.On<OperationStatus>("ReceiveOperationProgress", status =>
        {
            OnOperationProgress?.Invoke(status);
        });

        _hub.Reconnecting += _ =>
        {
            OnConnectionStateChanged?.Invoke(HubConnectionState.Reconnecting);
            return Task.CompletedTask;
        };

        _hub.Reconnected += _ =>
        {
            OnConnectionStateChanged?.Invoke(HubConnectionState.Connected);
            return Task.CompletedTask;
        };

        _hub.Closed += _ =>
        {
            OnConnectionStateChanged?.Invoke(HubConnectionState.Disconnected);
            return Task.CompletedTask;
        };
    }

    /// <summary>
    /// Starts the SignalR connection.
    /// </summary>
    public async Task ConnectAsync(CancellationToken ct = default)
    {
        if (_hub.State == HubConnectionState.Disconnected)
        {
            await _hub.StartAsync(ct);
            OnConnectionStateChanged?.Invoke(HubConnectionState.Connected);
        }
    }

    /// <summary>
    /// Stops the SignalR connection.
    /// </summary>
    public async Task DisconnectAsync(CancellationToken ct = default)
    {
        if (_hub.State != HubConnectionState.Disconnected)
        {
            await _hub.StopAsync(ct);
            OnConnectionStateChanged?.Invoke(HubConnectionState.Disconnected);
        }
    }

    #region Chat Service

    /// <summary>
    /// Sends a chat message and receives a complete response.
    /// </summary>
    public async Task<ChatResponse> SendMessageAsync(ChatRequest request, CancellationToken ct = default)
    {
        var response = await _http.PostAsJsonAsync("/api/chat", request, ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ChatResponse>(ct);
        return result ?? throw new InvalidOperationException("Received null response from chat endpoint");
    }

    /// <summary>
    /// Sends a chat message and streams the response in chunks.
    /// </summary>
    public async IAsyncEnumerable<ChatStreamChunk> StreamMessageAsync(
        ChatRequest request,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        var response = await _http.PostAsJsonAsync("/api/chat/stream", request, ct);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream && !ct.IsCancellationRequested)
        {
            var line = await reader.ReadLineAsync(ct);
            if (string.IsNullOrEmpty(line))
                continue;

            // Server-Sent Events format
            if (line.StartsWith("data: "))
            {
                var json = line[6..];
                if (json == "[DONE]")
                    break;

                var chunk = JsonSerializer.Deserialize<ChatStreamChunk>(json);
                if (chunk != null)
                    yield return chunk;
            }
        }
    }

    /// <summary>
    /// Handles the selection of a three-option response.
    /// </summary>
    public async Task<ThreeOptionResponse> HandleMistakeOptionAsync(
        int option,
        string sessionId,
        CancellationToken ct = default)
    {
        var response = await _http.PostAsJsonAsync(
            "/api/chat/mistake-option",
            new { Option = option, SessionId = sessionId },
            ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ThreeOptionResponse>(ct);
        return result ?? throw new InvalidOperationException("Received null response from mistake option endpoint");
    }

    #endregion

    #region Tree Service

    /// <summary>
    /// Gets the current tree structure for a learning goal.
    /// </summary>
    public async Task<TreeStructure?> GetTreeAsync(string goalName, CancellationToken ct = default)
    {
        var response = await _http.GetAsync($"/api/tree/{Uri.EscapeDataString(goalName)}", ct);

        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return null;

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<TreeStructure>(ct);
    }

    /// <summary>
    /// Generates a new learning tree for a goal.
    /// </summary>
    public async Task<OperationStatus> GenerateTreeAsync(TreeGenerationRequest request, CancellationToken ct = default)
    {
        var response = await _http.PostAsJsonAsync("/api/tree/generate", request, ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<OperationStatus>(ct);
        return result ?? throw new InvalidOperationException("Received null response from tree generation endpoint");
    }

    /// <summary>
    /// Gets a specific concept from the learning tree.
    /// </summary>
    public async Task<ConceptNode?> GetConceptAsync(string goalName, string conceptPath, CancellationToken ct = default)
    {
        var response = await _http.GetAsync(
            $"/api/tree/{Uri.EscapeDataString(goalName)}/concept/{Uri.EscapeDataString(conceptPath)}",
            ct);

        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return null;

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ConceptNode>(ct);
    }

    /// <summary>
    /// Navigates to a specific concept, updating learning progress.
    /// </summary>
    public async Task NavigateToConceptAsync(string goalName, string conceptPath, CancellationToken ct = default)
    {
        var response = await _http.PostAsync(
            $"/api/tree/{Uri.EscapeDataString(goalName)}/navigate/{Uri.EscapeDataString(conceptPath)}",
            null,
            ct);
        response.EnsureSuccessStatusCode();
    }

    #endregion

    #region Profile Service

    /// <summary>
    /// Gets the current learning profile.
    /// </summary>
    public async Task<LearningProfile?> GetProfileAsync(CancellationToken ct = default)
    {
        var response = await _http.GetAsync("/api/profile", ct);

        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return null;

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<LearningProfile>(ct);
    }

    /// <summary>
    /// Saves or updates the learning profile.
    /// </summary>
    public async Task<LearningProfile> SaveProfileAsync(LearningProfile profile, CancellationToken ct = default)
    {
        var response = await _http.PostAsJsonAsync("/api/profile", profile, ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<LearningProfile>(ct);
        return result ?? throw new InvalidOperationException("Received null response from profile save endpoint");
    }

    /// <summary>
    /// Checks whether a learning profile exists.
    /// </summary>
    public async Task<bool> ProfileExistsAsync(CancellationToken ct = default)
    {
        var response = await _http.GetAsync("/api/profile/exists", ct);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<bool>(ct);
    }

    #endregion

    #region Study Materials Service

    /// <summary>
    /// Uploads a study material file for a learning goal.
    /// </summary>
    public async Task<StudyMaterial> UploadMaterialAsync(
        string goalName,
        Stream fileStream,
        string fileName,
        CancellationToken ct = default)
    {
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);

        content.Add(streamContent, "file", fileName);
        content.Add(new StringContent(goalName), "goalName");

        var response = await _http.PostAsync("/api/materials", content, ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<StudyMaterial>(ct);
        return result ?? throw new InvalidOperationException("Received null response from material upload endpoint");
    }

    /// <summary>
    /// Gets all study materials for a learning goal.
    /// </summary>
    public async Task<IEnumerable<StudyMaterial>> GetMaterialsAsync(string goalName, CancellationToken ct = default)
    {
        var response = await _http.GetAsync($"/api/materials/{Uri.EscapeDataString(goalName)}", ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<IEnumerable<StudyMaterial>>(ct);
        return result ?? Enumerable.Empty<StudyMaterial>();
    }

    /// <summary>
    /// Deletes a study material.
    /// </summary>
    public async Task DeleteMaterialAsync(string materialId, CancellationToken ct = default)
    {
        var response = await _http.DeleteAsync($"/api/materials/{Uri.EscapeDataString(materialId)}", ct);
        response.EnsureSuccessStatusCode();
    }

    #endregion

    /// <inheritdoc />
    public void Dispose()
    {
        if (_disposed)
            return;

        _disposed = true;
        _http.Dispose();

        if (_hub.State != HubConnectionState.Disconnected)
        {
            // Best effort disconnect
            _ = _hub.DisposeAsync();
        }
    }
}
