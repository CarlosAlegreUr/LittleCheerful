#nullable enable

using System.Collections.Immutable;
using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LittleCheerful.Contracts.Models;
using LittleCheerful.Maui.Services;

namespace LittleCheerful.Maui.ViewModels;

/// <summary>
/// ViewModel for the Tree page.
/// </summary>
[QueryProperty(nameof(GoalName), "goalName")]
public partial class TreeViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;
    private readonly INavigationService _navigation;

    [ObservableProperty]
    private string title = "Concept Tree";

    [ObservableProperty]
    private string? goalName;

    [ObservableProperty]
    private TreeStructure? treeStructure;

    [ObservableProperty]
    private ObservableCollection<ConceptNodeViewModel> nodes = new();

    [ObservableProperty]
    private ConceptNodeViewModel? selectedNode;

    [ObservableProperty]
    private ConceptNode? selectedConcept;

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private string? errorMessage;

    public TreeViewModel(ApiClient apiClient, INavigationService navigation)
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
        if (string.IsNullOrEmpty(GoalName))
        {
            ErrorMessage = "No goal specified";
            return;
        }

        await LoadTreeAsync();
    }

    /// <summary>
    /// Loads the tree structure from the API.
    /// </summary>
    [RelayCommand]
    private async Task LoadTreeAsync()
    {
        if (string.IsNullOrEmpty(GoalName))
            return;

        IsLoading = true;
        ErrorMessage = null;

        try
        {
            var tree = await _apiClient.GetTreeAsync(GoalName);
            if (tree == null)
            {
                ErrorMessage = "Tree not found. Please create a new goal.";
                return;
            }

            TreeStructure = tree;
            Title = tree.Goal;

            // Convert to view models for display
            BuildNodeViewModels(tree);
        }
        catch (HttpRequestException ex)
        {
            ErrorMessage = $"Unable to load tree: {ex.Message}";
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error loading tree: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    private void BuildNodeViewModels(TreeStructure tree)
    {
        Nodes.Clear();

        // Find root nodes (nodes without parents)
        var rootPaths = tree.Tree.Keys
            .Where(path => !path.Contains('/'))
            .OrderBy(path => path);

        foreach (var path in rootPaths)
        {
            if (tree.Tree.TryGetValue(path, out var node))
            {
                var vm = new ConceptNodeViewModel(path, node, 0);
                AddChildNodes(vm, tree, 1);
                Nodes.Add(vm);
            }
        }
    }

    private void AddChildNodes(ConceptNodeViewModel parent, TreeStructure tree, int level)
    {
        foreach (var childPath in parent.Node.Children)
        {
            if (tree.Tree.TryGetValue(childPath, out var childNode))
            {
                var childVm = new ConceptNodeViewModel(childPath, childNode, level);
                AddChildNodes(childVm, tree, level + 1);
                parent.Children.Add(childVm);
            }
        }
    }

    /// <summary>
    /// Selects a concept node.
    /// </summary>
    [RelayCommand]
    private async Task SelectConceptAsync(ConceptNodeViewModel? nodeVm)
    {
        if (nodeVm == null || string.IsNullOrEmpty(GoalName))
            return;

        SelectedNode = nodeVm;

        try
        {
            // Load full concept details
            var concept = await _apiClient.GetConceptAsync(GoalName, nodeVm.Path);
            SelectedConcept = concept;
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error loading concept: {ex.Message}";
        }
    }

    /// <summary>
    /// Starts a learning session for the selected concept.
    /// </summary>
    [RelayCommand]
    private async Task StartSessionAsync()
    {
        if (string.IsNullOrEmpty(GoalName) || SelectedNode == null)
            return;

        // Navigate to concept and then to session
        try
        {
            await _apiClient.NavigateToConceptAsync(GoalName, SelectedNode.Path);

            await _navigation.NavigateToAsync("session", new Dictionary<string, object>
            {
                { "goalName", GoalName },
                { "conceptPath", SelectedNode.Path }
            });
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error starting session: {ex.Message}";
        }
    }

    /// <summary>
    /// Requests a breakdown of the selected concept.
    /// </summary>
    [RelayCommand]
    private async Task BreakdownConceptAsync()
    {
        if (SelectedNode == null)
            return;

        // This would trigger tree expansion via AI
        // For now, just show a message
        ErrorMessage = "Concept breakdown feature coming soon!";
        await Task.CompletedTask;
    }

    /// <summary>
    /// Creates a new goal.
    /// </summary>
    [RelayCommand]
    private async Task CreateNewGoalAsync()
    {
        await _navigation.NavigateToAsync("goalcreation");
    }
}

/// <summary>
/// ViewModel wrapper for ConceptNode for tree display.
/// </summary>
public partial class ConceptNodeViewModel : ObservableObject
{
    public string Path { get; }
    public ConceptNode Node { get; }
    public int Level { get; }

    [ObservableProperty]
    private bool isExpanded = true;

    public ObservableCollection<ConceptNodeViewModel> Children { get; } = new();

    public string DisplayName => Node.Name;
    public string StatusDisplay => Node.Status.ToString();
    public string Indent => new string(' ', Level * 4);

    public ConceptNodeViewModel(string path, ConceptNode node, int level)
    {
        Path = path;
        Node = node;
        Level = level;
    }
}
