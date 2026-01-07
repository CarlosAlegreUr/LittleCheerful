#nullable enable

using System.Collections.Concurrent;
using System.Collections.Immutable;
using System.Text.Json;
using System.Threading.Channels;
using LittleCheerful.Api.Configuration;
using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Enums;
using LittleCheerful.Contracts.Models;
using Microsoft.Extensions.Options;

namespace LittleCheerful.Api.Services;

/// <summary>
/// Manages the learning tree structure and concept navigation.
/// </summary>
public sealed class TreeService : ITreeService
{
    private readonly IFileStateService _fileStateService;
    private readonly IClaudeCliService _claudeCliService;
    private readonly LittleCheerfulOptions _options;
    private readonly ILogger<TreeService> _logger;

    // In-memory operation tracking (production would use persistent storage)
    private static readonly ConcurrentDictionary<string, OperationStatus> Operations = new();

    // Job queue for background processing
    private static readonly Channel<TreeGenerationJob> JobChannel =
        Channel.CreateUnbounded<TreeGenerationJob>();

    public TreeService(
        IFileStateService fileStateService,
        IClaudeCliService claudeCliService,
        IOptions<LittleCheerfulOptions> options,
        ILogger<TreeService> logger)
    {
        _fileStateService = fileStateService;
        _claudeCliService = claudeCliService;
        _options = options.Value;
        _logger = logger;
    }

    /// <summary>
    /// Gets the job channel for background processing.
    /// </summary>
    public static ChannelReader<TreeGenerationJob> JobReader => JobChannel.Reader;

    /// <inheritdoc />
    public async Task<TreeStructure> GetCurrentTreeAsync(string goalName, CancellationToken ct)
    {
        _logger.LogInformation("Getting tree for goal: {Goal}", goalName);

        var tree = await _fileStateService.ReadTreeAsync(goalName, ct);

        if (tree == null)
        {
            _logger.LogInformation("No tree found for goal: {Goal}, returning empty tree", goalName);
            return new TreeStructure
            {
                Goal = goalName,
                Created = DateTimeOffset.UtcNow,
                LastUpdated = DateTimeOffset.UtcNow,
                MaxConcepts = 100,
                TotalConcepts = 0,
                Tree = ImmutableDictionary<string, ConceptNode>.Empty
            };
        }

        return tree;
    }

    /// <inheritdoc />
    public Task<OperationStatus> GenerateTreeAsync(TreeGenerationRequest request, CancellationToken ct)
    {
        _logger.LogInformation("Queueing tree generation for goal: {Goal}", request.GoalName);

        var operationId = Guid.NewGuid().ToString("N");

        var status = new OperationStatus
        {
            OperationId = operationId,
            State = OperationState.Queued,
            ProgressPercent = 0,
            CurrentStep = "Waiting to start..."
        };

        Operations[operationId] = status;

        // Queue the job for background processing
        var job = new TreeGenerationJob(operationId, request);
        JobChannel.Writer.TryWrite(job);

        return Task.FromResult(status);
    }

    /// <inheritdoc />
    public async Task<ConceptNode> GetConceptAsync(string goalName, string conceptPath, CancellationToken ct)
    {
        _logger.LogInformation("Getting concept {Path} for goal: {Goal}", conceptPath, goalName);

        var tree = await _fileStateService.ReadTreeAsync(goalName, ct);
        ConceptNode? existingNode = null;

        if (tree != null && tree.Tree.TryGetValue(conceptPath, out var node))
        {
            existingNode = node;

            // If we have a full node with content, return it
            if (!string.IsNullOrEmpty(node.Explanation))
            {
                return node;
            }
        }

        // Try to read concept file for additional content
        var conceptContent = await _fileStateService.ReadConceptAsync(goalName, conceptPath, ct);

        if (conceptContent != null)
        {
            return ParseConceptMarkdown(conceptContent, conceptPath, existingNode);
        }

        // Return a stub node if nothing found
        return new ConceptNode
        {
            Name = conceptPath.Split('/').LastOrDefault() ?? conceptPath,
            Status = ConceptStatus.NotStarted,
            Tags = ConceptTag.None,
            Children = ImmutableArray<string>.Empty,
            Sources = ImmutableArray<ConceptSource>.Empty
        };
    }

    /// <inheritdoc />
    public async Task NavigateToConceptAsync(string goalName, string conceptPath, CancellationToken ct)
    {
        _logger.LogInformation("Navigating to concept {Path} for goal: {Goal}", conceptPath, goalName);

        var tree = await _fileStateService.ReadTreeAsync(goalName, ct);

        if (tree == null)
        {
            _logger.LogWarning("Cannot navigate: no tree exists for goal {Goal}", goalName);
            return;
        }

        if (!tree.Tree.TryGetValue(conceptPath, out var node))
        {
            _logger.LogWarning("Concept {Path} not found in tree for goal {Goal}", conceptPath, goalName);
            return;
        }

        // Update concept status if not started
        if (node.Status == ConceptStatus.NotStarted)
        {
            var updatedNode = node with { Status = ConceptStatus.InProgress };
            var updatedTree = tree.Tree.SetItem(conceptPath, updatedNode);
            var newTree = tree with
            {
                Tree = updatedTree,
                LastUpdated = DateTimeOffset.UtcNow
            };

            await _fileStateService.WriteTreeAsync(goalName, newTree, ct);
        }
    }

    /// <summary>
    /// Updates the operation status (called by background service).
    /// </summary>
    public static void UpdateOperationStatus(string operationId, OperationStatus status)
    {
        Operations[operationId] = status;
    }

    /// <summary>
    /// Gets the operation status.
    /// </summary>
    public static OperationStatus? GetOperationStatus(string operationId)
    {
        Operations.TryGetValue(operationId, out var status);
        return status;
    }

    private static ConceptNode ParseConceptMarkdown(string markdown, string path, ConceptNode? existingNode)
    {
        // Parse concept.md format:
        // # Concept Name
        // ## Overview
        // Brief overview text
        // ## Explanation
        // Full explanation text
        // ## Sources
        // - [Title](URL) - Type

        var lines = markdown.Split('\n');
        string name = path.Split('/').LastOrDefault() ?? path;
        string? overview = null;
        string? explanation = null;
        var sources = new List<ConceptSource>();

        string? currentSection = null;
        var sectionContent = new System.Text.StringBuilder();

        foreach (var line in lines)
        {
            if (line.StartsWith("# "))
            {
                name = line.Substring(2).Trim();
            }
            else if (line.StartsWith("## "))
            {
                // Save previous section
                SaveSection(currentSection, sectionContent.ToString().Trim(), ref overview, ref explanation);
                sectionContent.Clear();
                currentSection = line.Substring(3).Trim().ToLowerInvariant();
            }
            else if (currentSection == "sources" && line.StartsWith("- ["))
            {
                var source = ParseSourceLine(line);
                if (source != null)
                {
                    sources.Add(source);
                }
            }
            else if (currentSection != null)
            {
                sectionContent.AppendLine(line);
            }
        }

        // Save last section
        SaveSection(currentSection, sectionContent.ToString().Trim(), ref overview, ref explanation);

        return new ConceptNode
        {
            Name = name,
            Status = existingNode?.Status ?? ConceptStatus.NotStarted,
            Tags = existingNode?.Tags ?? ConceptTag.None,
            LastReviewed = existingNode?.LastReviewed,
            Parent = existingNode?.Parent,
            Children = existingNode?.Children ?? ImmutableArray<string>.Empty,
            Overview = overview,
            Explanation = explanation,
            Sources = sources.ToImmutableArray()
        };
    }

    private static void SaveSection(string? section, string content, ref string? overview, ref string? explanation)
    {
        switch (section)
        {
            case "overview":
                overview = content;
                break;
            case "explanation":
                explanation = content;
                break;
        }
    }

    private static ConceptSource? ParseSourceLine(string line)
    {
        // Format: - [Title](URL) - Type
        try
        {
            var titleStart = line.IndexOf('[') + 1;
            var titleEnd = line.IndexOf(']');
            var urlStart = line.IndexOf('(') + 1;
            var urlEnd = line.IndexOf(')');

            if (titleStart > 0 && titleEnd > titleStart && urlStart > 0 && urlEnd > urlStart)
            {
                var title = line.Substring(titleStart, titleEnd - titleStart);
                var url = line.Substring(urlStart, urlEnd - urlStart);
                var type = "Article";

                var typeStart = line.LastIndexOf('-');
                if (typeStart > urlEnd)
                {
                    type = line.Substring(typeStart + 1).Trim();
                }

                return new ConceptSource
                {
                    Title = title,
                    Url = url,
                    Type = type,
                    Fetched = DateTimeOffset.UtcNow
                };
            }
        }
        catch
        {
            // Ignore parse errors
        }

        return null;
    }
}

/// <summary>
/// Represents a tree generation job for background processing.
/// </summary>
public sealed record TreeGenerationJob(string OperationId, TreeGenerationRequest Request);
