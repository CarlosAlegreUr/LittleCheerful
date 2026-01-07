#nullable enable

using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LittleCheerful.Contracts.Models;
using LittleCheerful.Maui.Services;

namespace LittleCheerful.Maui.ViewModels;

/// <summary>
/// ViewModel for the Materials page.
/// </summary>
[QueryProperty(nameof(GoalName), "goalName")]
public partial class MaterialsViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;

    [ObservableProperty]
    private string title = "Study Materials";

    [ObservableProperty]
    private string? goalName;

    [ObservableProperty]
    private ObservableCollection<StudyMaterialViewModel> materials = new();

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private bool isUploading;

    [ObservableProperty]
    private string? errorMessage;

    [ObservableProperty]
    private int uploadProgress;

    public MaterialsViewModel(ApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    /// <summary>
    /// Called when the page appears.
    /// </summary>
    [RelayCommand]
    private async Task AppearingAsync()
    {
        await LoadMaterialsAsync();
    }

    /// <summary>
    /// Loads materials from the API.
    /// </summary>
    [RelayCommand]
    private async Task LoadMaterialsAsync()
    {
        if (string.IsNullOrEmpty(GoalName))
            return;

        IsLoading = true;
        ErrorMessage = null;

        try
        {
            var result = await _apiClient.GetMaterialsAsync(GoalName);

            Materials.Clear();
            foreach (var material in result)
            {
                Materials.Add(new StudyMaterialViewModel(material));
            }
        }
        catch (HttpRequestException ex)
        {
            ErrorMessage = $"Unable to load materials: {ex.Message}";
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error loading materials: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    /// <summary>
    /// Opens file picker and uploads selected file.
    /// </summary>
    [RelayCommand]
    private async Task UploadMaterialAsync()
    {
        if (string.IsNullOrEmpty(GoalName))
        {
            ErrorMessage = "No goal specified. Please select a goal first.";
            return;
        }

        try
        {
            var options = new PickOptions
            {
                PickerTitle = "Select a study material",
                FileTypes = new FilePickerFileType(new Dictionary<DevicePlatform, IEnumerable<string>>
                {
                    { DevicePlatform.WinUI, new[] { ".pdf", ".txt", ".md", ".docx", ".doc", ".epub" } },
                    { DevicePlatform.Android, new[] { "application/pdf", "text/plain", "text/markdown", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" } },
                    { DevicePlatform.iOS, new[] { "com.adobe.pdf", "public.plain-text", "net.daringfireball.markdown", "org.openxmlformats.wordprocessingml.document" } },
                    { DevicePlatform.MacCatalyst, new[] { "com.adobe.pdf", "public.plain-text", "net.daringfireball.markdown", "org.openxmlformats.wordprocessingml.document" } }
                })
            };

            var result = await FilePicker.Default.PickAsync(options);

            if (result == null)
                return;

            IsUploading = true;
            UploadProgress = 0;
            ErrorMessage = null;

            await using var stream = await result.OpenReadAsync();

            var material = await _apiClient.UploadMaterialAsync(GoalName, stream, result.FileName);

            Materials.Add(new StudyMaterialViewModel(material));
            UploadProgress = 100;
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error uploading file: {ex.Message}";
        }
        finally
        {
            IsUploading = false;
        }
    }

    /// <summary>
    /// Deletes a material.
    /// </summary>
    [RelayCommand]
    private async Task DeleteMaterialAsync(StudyMaterialViewModel? materialVm)
    {
        if (materialVm == null)
            return;

        IsLoading = true;
        ErrorMessage = null;

        try
        {
            await _apiClient.DeleteMaterialAsync(materialVm.Material.Id);
            Materials.Remove(materialVm);
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error deleting material: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }
}

/// <summary>
/// ViewModel wrapper for StudyMaterial for display.
/// </summary>
public class StudyMaterialViewModel
{
    public StudyMaterial Material { get; }

    public string FileName => Material.FileName;
    public string GoalName => Material.GoalName;
    public string UploadedAt => Material.UploadedAt.LocalDateTime.ToString("g");
    public string FileExtension => Path.GetExtension(Material.FileName).TrimStart('.').ToUpperInvariant();
    public bool HasExtractedText => !string.IsNullOrEmpty(Material.ExtractedText);

    public StudyMaterialViewModel(StudyMaterial material)
    {
        Material = material;
    }
}
