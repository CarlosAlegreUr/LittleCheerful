#nullable enable

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LittleCheerful.Contracts.Enums;
using LittleCheerful.Contracts.Models;
using LittleCheerful.Maui.Services;

namespace LittleCheerful.Maui.ViewModels;

/// <summary>
/// ViewModel for the Goal Creation page.
/// </summary>
public partial class GoalCreationViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;
    private readonly INavigationService _navigation;

    [ObservableProperty]
    private string title = "Create Goal";

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(CreateGoalCommand))]
    private string goalName = string.Empty;

    [ObservableProperty]
    private string? initialAssessment;

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private bool isGenerating;

    [ObservableProperty]
    private int generationProgress;

    [ObservableProperty]
    private string? generationStatus;

    [ObservableProperty]
    private string? errorMessage;

    private string? _currentOperationId;
    private CancellationTokenSource? _progressCts;

    public GoalCreationViewModel(ApiClient apiClient, INavigationService navigation)
    {
        _apiClient = apiClient;
        _navigation = navigation;

        // Subscribe to operation progress updates
        _apiClient.OnOperationProgress += HandleOperationProgress;
    }

    private bool CanCreateGoal => !string.IsNullOrWhiteSpace(GoalName) && !IsLoading && !IsGenerating;

    /// <summary>
    /// Creates a new learning goal and generates the tree.
    /// </summary>
    [RelayCommand(CanExecute = nameof(CanCreateGoal))]
    private async Task CreateGoalAsync()
    {
        IsLoading = true;
        ErrorMessage = null;

        try
        {
            var request = new TreeGenerationRequest
            {
                GoalName = GoalName.Trim(),
                InitialAssessment = string.IsNullOrWhiteSpace(InitialAssessment) ? null : InitialAssessment.Trim()
            };

            var status = await _apiClient.GenerateTreeAsync(request);
            _currentOperationId = status.OperationId;

            // Start progress tracking
            IsGenerating = true;
            IsLoading = false;
            GenerationProgress = status.ProgressPercent;
            GenerationStatus = status.CurrentStep ?? "Starting tree generation...";

            // Connect SignalR for progress updates
            await _apiClient.ConnectAsync();

            // Also poll for progress as a fallback
            _progressCts = new CancellationTokenSource();
            _ = PollProgressAsync(_progressCts.Token);
        }
        catch (HttpRequestException ex)
        {
            ErrorMessage = $"Unable to create goal: {ex.Message}";
            IsLoading = false;
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error creating goal: {ex.Message}";
            IsLoading = false;
        }
    }

    private void HandleOperationProgress(OperationStatus status)
    {
        if (status.OperationId != _currentOperationId)
            return;

        MainThread.BeginInvokeOnMainThread(async () =>
        {
            GenerationProgress = status.ProgressPercent;
            GenerationStatus = status.CurrentStep ?? "Processing...";

            if (status.State == OperationState.Completed)
            {
                await OnGenerationCompleteAsync();
            }
            else if (status.State == OperationState.Failed)
            {
                OnGenerationFailed(status.ErrorMessage ?? "Unknown error occurred");
            }
        });
    }

    private async Task PollProgressAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested && IsGenerating)
        {
            try
            {
                await Task.Delay(2000, ct);

                // Check if tree is ready
                var tree = await _apiClient.GetTreeAsync(GoalName, ct);
                if (tree != null)
                {
                    await OnGenerationCompleteAsync();
                    break;
                }
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch
            {
                // Continue polling
            }
        }
    }

    private async Task OnGenerationCompleteAsync()
    {
        _progressCts?.Cancel();
        IsGenerating = false;
        GenerationProgress = 100;
        GenerationStatus = "Complete!";

        // Navigate to tree view
        await _navigation.NavigateToAsync("//tree", new Dictionary<string, object>
        {
            { "goalName", GoalName }
        });
    }

    private void OnGenerationFailed(string error)
    {
        _progressCts?.Cancel();
        IsGenerating = false;
        ErrorMessage = $"Tree generation failed: {error}";
    }

    /// <summary>
    /// Cancels the current goal creation process.
    /// </summary>
    [RelayCommand]
    private async Task CancelAsync()
    {
        _progressCts?.Cancel();
        IsLoading = false;
        IsGenerating = false;

        await _navigation.GoBackAsync();
    }
}
