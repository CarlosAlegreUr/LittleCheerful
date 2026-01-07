#nullable enable

using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LittleCheerful.Contracts.Models;
using LittleCheerful.Maui.Services;

namespace LittleCheerful.Maui.ViewModels;

/// <summary>
/// ViewModel for the Home page.
/// </summary>
public partial class HomeViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;
    private readonly INavigationService _navigation;

    [ObservableProperty]
    private string title = "Home";

    [ObservableProperty]
    private string greeting = "Welcome to Little Cheerful!";

    [ObservableProperty]
    private string? currentGoalName;

    [ObservableProperty]
    private bool hasProfile;

    [ObservableProperty]
    private bool hasGoal;

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private string? errorMessage;

    [ObservableProperty]
    private ObservableCollection<string> recentGoals = new();

    public HomeViewModel(ApiClient apiClient, INavigationService navigation)
    {
        _apiClient = apiClient;
        _navigation = navigation;
    }

    /// <summary>
    /// Called when the page appears to check profile status and load data.
    /// </summary>
    [RelayCommand]
    private async Task AppearingAsync()
    {
        IsLoading = true;
        ErrorMessage = null;

        try
        {
            // Check if profile exists
            HasProfile = await _apiClient.ProfileExistsAsync();

            if (!HasProfile)
            {
                // First time user - navigate to surprise page
                await _navigation.NavigateToAsync("surprise");
                return;
            }

            // Load profile for greeting
            var profile = await _apiClient.GetProfileAsync();
            if (profile != null)
            {
                Greeting = $"Welcome back! Ready to learn?";
            }

            // Check if there's a current goal (this would be persisted locally in a real app)
            // For now, we'll check if any trees exist
            HasGoal = !string.IsNullOrEmpty(CurrentGoalName);
        }
        catch (HttpRequestException ex)
        {
            ErrorMessage = $"Unable to connect to server: {ex.Message}";
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error loading home: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    /// <summary>
    /// Navigates to create a new learning goal.
    /// </summary>
    [RelayCommand]
    private async Task StartNewGoalAsync()
    {
        await _navigation.NavigateToAsync("goalcreation");
    }

    /// <summary>
    /// Navigates to continue learning the current goal.
    /// </summary>
    [RelayCommand]
    private async Task ContinueLearningAsync()
    {
        if (string.IsNullOrEmpty(CurrentGoalName))
        {
            await _navigation.NavigateToAsync("goalcreation");
            return;
        }

        // Navigate to tree view for current goal
        await _navigation.NavigateToAsync("//tree", new Dictionary<string, object>
        {
            { "goalName", CurrentGoalName }
        });
    }

    /// <summary>
    /// Navigates to the settings page.
    /// </summary>
    [RelayCommand]
    private async Task GoToSettingsAsync()
    {
        await _navigation.NavigateToAsync("//settings");
    }
}
