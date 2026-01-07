#nullable enable

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LittleCheerful.Contracts.Enums;
using LittleCheerful.Contracts.Models;
using LittleCheerful.Maui.Services;

namespace LittleCheerful.Maui.ViewModels;

/// <summary>
/// ViewModel for the Settings page.
/// </summary>
public partial class SettingsViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;
    private readonly INavigationService _navigation;

    [ObservableProperty]
    private string title = "Settings";

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private string? errorMessage;

    [ObservableProperty]
    private string? successMessage;

    // Profile properties
    [ObservableProperty]
    private TeachingTone selectedTone = TeachingTone.Balanced;

    [ObservableProperty]
    private string? customToneDescription;

    [ObservableProperty]
    private MotivationStyle selectedMotivation = MotivationStyle.Balanced;

    [ObservableProperty]
    private int sourceDepth = 2;

    [ObservableProperty]
    private TerminologyLevel selectedTerminology = TerminologyLevel.Adaptive;

    [ObservableProperty]
    private ExamplePreference selectedExamples = ExamplePreference.Both;

    [ObservableProperty]
    private string preferredLanguage = "English";

    [ObservableProperty]
    private DateTimeOffset? profileCreated;

    [ObservableProperty]
    private DateTimeOffset? profileUpdated;

    // Available options
    public IReadOnlyList<TeachingTone> ToneOptions { get; } = Enum.GetValues<TeachingTone>();
    public IReadOnlyList<MotivationStyle> MotivationOptions { get; } = Enum.GetValues<MotivationStyle>();
    public IReadOnlyList<TerminologyLevel> TerminologyOptions { get; } = Enum.GetValues<TerminologyLevel>();
    public IReadOnlyList<ExamplePreference> ExampleOptions { get; } = Enum.GetValues<ExamplePreference>();
    public IReadOnlyList<string> LanguageOptions { get; } = new[] { "English", "Spanish", "French", "German", "Japanese", "Chinese", "Portuguese", "Other" };

    public SettingsViewModel(ApiClient apiClient, INavigationService navigation)
    {
        _apiClient = apiClient;
        _navigation = navigation;
    }

    /// <summary>
    /// Called when the page appears.
    /// </summary>
    [RelayCommand]
    private async Task AppearingAsync()
    {
        await LoadProfileAsync();
    }

    /// <summary>
    /// Loads the current profile from the API.
    /// </summary>
    [RelayCommand]
    private async Task LoadProfileAsync()
    {
        IsLoading = true;
        ErrorMessage = null;
        SuccessMessage = null;

        try
        {
            var profile = await _apiClient.GetProfileAsync();
            if (profile != null)
            {
                SelectedTone = profile.Tone;
                CustomToneDescription = profile.CustomToneDescription;
                SelectedMotivation = profile.Motivation;
                SourceDepth = profile.SourceDepth;
                SelectedTerminology = profile.Terminology;
                SelectedExamples = profile.Examples;
                PreferredLanguage = profile.PreferredLanguage;
                ProfileCreated = profile.Created;
                ProfileUpdated = profile.LastUpdated;
            }
        }
        catch (HttpRequestException ex)
        {
            ErrorMessage = $"Unable to load profile: {ex.Message}";
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error loading profile: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    /// <summary>
    /// Saves the profile to the API.
    /// </summary>
    [RelayCommand]
    private async Task SaveProfileAsync()
    {
        IsLoading = true;
        ErrorMessage = null;
        SuccessMessage = null;

        try
        {
            var profile = new LearningProfile
            {
                Tone = SelectedTone,
                CustomToneDescription = SelectedTone == TeachingTone.Other ? CustomToneDescription : null,
                Motivation = SelectedMotivation,
                SourceDepth = SourceDepth,
                Terminology = SelectedTerminology,
                Examples = SelectedExamples,
                PreferredLanguage = PreferredLanguage,
                Created = ProfileCreated ?? DateTimeOffset.UtcNow
            };

            var saved = await _apiClient.SaveProfileAsync(profile);
            ProfileUpdated = saved.LastUpdated;

            SuccessMessage = "Profile saved successfully!";
        }
        catch (HttpRequestException ex)
        {
            ErrorMessage = $"Unable to save profile: {ex.Message}";
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error saving profile: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    /// <summary>
    /// Resets profile to defaults.
    /// </summary>
    [RelayCommand]
    private async Task ResetProfileAsync()
    {
        SelectedTone = TeachingTone.Balanced;
        CustomToneDescription = null;
        SelectedMotivation = MotivationStyle.Balanced;
        SourceDepth = 2;
        SelectedTerminology = TerminologyLevel.Adaptive;
        SelectedExamples = ExamplePreference.Both;
        PreferredLanguage = "English";

        await SaveProfileAsync();
    }

    /// <summary>
    /// Runs onboarding again.
    /// </summary>
    [RelayCommand]
    private async Task RunOnboardingAsync()
    {
        await _navigation.NavigateToAsync("onboarding");
    }
}
