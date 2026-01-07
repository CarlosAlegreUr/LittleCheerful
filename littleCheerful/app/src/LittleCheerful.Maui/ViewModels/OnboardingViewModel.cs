#nullable enable

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LittleCheerful.Contracts.Enums;
using LittleCheerful.Contracts.Models;
using LittleCheerful.Maui.Services;

namespace LittleCheerful.Maui.ViewModels;

/// <summary>
/// ViewModel for the Onboarding page (6-step wizard).
/// </summary>
public partial class OnboardingViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;
    private readonly INavigationService _navigation;

    private const int TotalSteps = 6;

    [ObservableProperty]
    private string title = "Onboarding";

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(StepTitle))]
    [NotifyPropertyChangedFor(nameof(StepDescription))]
    [NotifyPropertyChangedFor(nameof(CanGoBack))]
    [NotifyPropertyChangedFor(nameof(IsLastStep))]
    [NotifyPropertyChangedFor(nameof(StepProgress))]
    private int currentStep;

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private string? errorMessage;

    // Step 1: Teaching Tone
    [ObservableProperty]
    private TeachingTone selectedTone = TeachingTone.Balanced;

    [ObservableProperty]
    private string? customToneDescription;

    // Step 2: Motivation Style
    [ObservableProperty]
    private MotivationStyle selectedMotivation = MotivationStyle.Balanced;

    // Step 3: Source Depth (1-4)
    [ObservableProperty]
    private int sourceDepth = 2;

    // Step 4: Terminology Level
    [ObservableProperty]
    private TerminologyLevel selectedTerminology = TerminologyLevel.Adaptive;

    // Step 5: Example Preference
    [ObservableProperty]
    private ExamplePreference selectedExamples = ExamplePreference.Both;

    // Step 6: Preferred Language
    [ObservableProperty]
    private string preferredLanguage = "English";

    public string StepTitle => CurrentStep switch
    {
        0 => "Teaching Style",
        1 => "Motivation",
        2 => "Source Depth",
        3 => "Terminology",
        4 => "Examples",
        5 => "Language",
        _ => "Complete"
    };

    public string StepDescription => CurrentStep switch
    {
        0 => "How would you like me to communicate with you?",
        1 => "What kind of motivation works best for you?",
        2 => "How deep should I go when citing sources?",
        3 => "What level of terminology should I use?",
        4 => "How should I explain concepts?",
        5 => "What's your preferred language for learning?",
        _ => "You're all set!"
    };

    public bool CanGoBack => CurrentStep > 0;
    public bool IsLastStep => CurrentStep == TotalSteps - 1;
    public double StepProgress => (double)(CurrentStep + 1) / TotalSteps;

    public IReadOnlyList<TeachingTone> ToneOptions { get; } = Enum.GetValues<TeachingTone>();
    public IReadOnlyList<MotivationStyle> MotivationOptions { get; } = Enum.GetValues<MotivationStyle>();
    public IReadOnlyList<TerminologyLevel> TerminologyOptions { get; } = Enum.GetValues<TerminologyLevel>();
    public IReadOnlyList<ExamplePreference> ExampleOptions { get; } = Enum.GetValues<ExamplePreference>();
    public IReadOnlyList<string> LanguageOptions { get; } = new[] { "English", "Spanish", "French", "German", "Japanese", "Chinese", "Portuguese", "Other" };

    public OnboardingViewModel(ApiClient apiClient, INavigationService navigation)
    {
        _apiClient = apiClient;
        _navigation = navigation;
    }

    /// <summary>
    /// Moves to the next step in the wizard.
    /// </summary>
    [RelayCommand]
    private async Task NextAsync()
    {
        if (IsLastStep)
        {
            await CompleteOnboardingAsync();
        }
        else
        {
            CurrentStep++;
        }
    }

    /// <summary>
    /// Moves to the previous step in the wizard.
    /// </summary>
    [RelayCommand]
    private void Back()
    {
        if (CanGoBack)
        {
            CurrentStep--;
        }
    }

    /// <summary>
    /// Completes the onboarding process and saves the profile.
    /// </summary>
    private async Task CompleteOnboardingAsync()
    {
        IsLoading = true;
        ErrorMessage = null;

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
                Created = DateTimeOffset.UtcNow
            };

            await _apiClient.SaveProfileAsync(profile);

            // Navigate to home page
            await _navigation.GoToRootAsync();
        }
        catch (HttpRequestException ex)
        {
            ErrorMessage = $"Unable to save profile: {ex.Message}";
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error completing onboarding: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    /// <summary>
    /// Skips onboarding with default settings.
    /// </summary>
    [RelayCommand]
    private async Task SkipAsync()
    {
        // Use defaults and complete
        await CompleteOnboardingAsync();
    }
}
