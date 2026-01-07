#nullable enable

using System.Collections.Immutable;
using LittleCheerful.Api.Configuration;
using LittleCheerful.Api.Hubs;
using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Enums;
using LittleCheerful.Contracts.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;

namespace LittleCheerful.Api.Services;

/// <summary>
/// Background service that processes tree generation jobs.
/// </summary>
public sealed class BackgroundJobService : BackgroundService
{
    private readonly IClaudeCliService _claudeCliService;
    private readonly IFileStateService _fileStateService;
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly LittleCheerfulOptions _options;
    private readonly ILogger<BackgroundJobService> _logger;

    public BackgroundJobService(
        IClaudeCliService claudeCliService,
        IFileStateService fileStateService,
        IHubContext<ChatHub> hubContext,
        IOptions<LittleCheerfulOptions> options,
        ILogger<BackgroundJobService> logger)
    {
        _claudeCliService = claudeCliService;
        _fileStateService = fileStateService;
        _hubContext = hubContext;
        _options = options.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("BackgroundJobService started");

        await foreach (var job in TreeService.JobReader.ReadAllAsync(stoppingToken))
        {
            try
            {
                await ProcessTreeGenerationJobAsync(job, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing tree generation job {OperationId}", job.OperationId);

                TreeService.UpdateOperationStatus(job.OperationId, new OperationStatus
                {
                    OperationId = job.OperationId,
                    State = OperationState.Failed,
                    ProgressPercent = 0,
                    ErrorMessage = ex.Message
                });
            }
        }

        _logger.LogInformation("BackgroundJobService stopped");
    }

    private async Task ProcessTreeGenerationJobAsync(TreeGenerationJob job, CancellationToken ct)
    {
        _logger.LogInformation("Processing tree generation job {OperationId} for goal {Goal}",
            job.OperationId, job.Request.GoalName);

        // Update status to running
        await UpdateAndBroadcastStatus(job.OperationId, new OperationStatus
        {
            OperationId = job.OperationId,
            State = OperationState.Running,
            ProgressPercent = 10,
            CurrentStep = "Analyzing learning goal..."
        });

        // Build the prompt for tree generation
        var prompt = BuildTreeGenerationPrompt(job.Request);

        // Execute Claude CLI with progress
        var progress = new Progress<string>(chunk =>
        {
            // Broadcast progress chunks to clients
            _ = _hubContext.Clients.All.SendAsync("OnOperationProgress", job.OperationId, chunk, ct);
        });

        await UpdateAndBroadcastStatus(job.OperationId, new OperationStatus
        {
            OperationId = job.OperationId,
            State = OperationState.Running,
            ProgressPercent = 30,
            CurrentStep = "Generating concept tree..."
        });

        var response = await _claudeCliService.ExecuteWithTimeoutAsync(
            $"-p \"{EscapeForCli(prompt)}\"",
            null,
            TimeSpan.FromSeconds(_options.TreeGenerationTimeoutSeconds),
            progress,
            ct);

        if (!response.Success)
        {
            await UpdateAndBroadcastStatus(job.OperationId, new OperationStatus
            {
                OperationId = job.OperationId,
                State = OperationState.Failed,
                ProgressPercent = 0,
                ErrorMessage = response.ErrorMessage ?? "Tree generation failed"
            });
            return;
        }

        await UpdateAndBroadcastStatus(job.OperationId, new OperationStatus
        {
            OperationId = job.OperationId,
            State = OperationState.Running,
            ProgressPercent = 70,
            CurrentStep = "Parsing generated tree..."
        });

        // Parse the response into a tree structure
        var tree = ParseTreeFromResponse(response.Output, job.Request.GoalName);

        await UpdateAndBroadcastStatus(job.OperationId, new OperationStatus
        {
            OperationId = job.OperationId,
            State = OperationState.Running,
            ProgressPercent = 90,
            CurrentStep = "Saving tree structure..."
        });

        // Save the tree
        await _fileStateService.WriteTreeAsync(job.Request.GoalName, tree, ct);

        // Complete
        await UpdateAndBroadcastStatus(job.OperationId, new OperationStatus
        {
            OperationId = job.OperationId,
            State = OperationState.Completed,
            ProgressPercent = 100,
            CurrentStep = "Complete",
            Result = tree
        });

        _logger.LogInformation("Tree generation completed for goal {Goal}, {Concepts} concepts generated",
            job.Request.GoalName, tree.TotalConcepts);
    }

    private async Task UpdateAndBroadcastStatus(string operationId, OperationStatus status)
    {
        TreeService.UpdateOperationStatus(operationId, status);

        try
        {
            await _hubContext.Clients.All.SendAsync(
                "OnOperationProgress",
                operationId,
                $"[{status.State}] {status.CurrentStep} ({status.ProgressPercent}%)");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to broadcast operation status");
        }
    }

    private static string BuildTreeGenerationPrompt(TreeGenerationRequest request)
    {
        var prompt = $@"Generate a learning tree for the goal: {request.GoalName}

Please output a JSON structure with the following format:
{{
  ""goal"": ""{request.GoalName}"",
  ""concepts"": [
    {{
      ""path"": ""concept1"",
      ""name"": ""Concept Name"",
      ""overview"": ""Brief overview"",
      ""children"": [""concept1/subA"", ""concept1/subB""]
    }}
  ]
}}

Requirements:
- Create 5-15 concepts organized hierarchically
- Each concept should have a clear path (using / for nesting)
- Include brief overviews for each concept
- Order concepts by learning dependency (prerequisites first)";

        if (!string.IsNullOrEmpty(request.InitialAssessment))
        {
            prompt += $"\n\nInitial assessment from user:\n{request.InitialAssessment}";
        }

        return prompt;
    }

    private static TreeStructure ParseTreeFromResponse(string output, string goalName)
    {
        // Try to find JSON in the response
        var jsonStart = output.IndexOf('{');
        var jsonEnd = output.LastIndexOf('}');

        if (jsonStart >= 0 && jsonEnd > jsonStart)
        {
            try
            {
                var json = output.Substring(jsonStart, jsonEnd - jsonStart + 1);
                var parsed = System.Text.Json.JsonSerializer.Deserialize<TreeGenerationOutput>(json);

                if (parsed?.Concepts != null)
                {
                    var treeDict = new Dictionary<string, ConceptNode>();

                    foreach (var concept in parsed.Concepts)
                    {
                        var node = new ConceptNode
                        {
                            Name = concept.Name ?? concept.Path ?? "Unknown",
                            Status = ConceptStatus.NotStarted,
                            Tags = ConceptTag.None,
                            Parent = GetParentPath(concept.Path),
                            Children = concept.Children?.ToImmutableArray() ?? ImmutableArray<string>.Empty,
                            Overview = concept.Overview,
                            Sources = ImmutableArray<ConceptSource>.Empty
                        };

                        if (!string.IsNullOrEmpty(concept.Path))
                        {
                            treeDict[concept.Path] = node;
                        }
                    }

                    return new TreeStructure
                    {
                        Goal = goalName,
                        Created = DateTimeOffset.UtcNow,
                        LastUpdated = DateTimeOffset.UtcNow,
                        MaxConcepts = 100,
                        TotalConcepts = treeDict.Count,
                        Tree = treeDict.ToImmutableDictionary()
                    };
                }
            }
            catch
            {
                // Fall through to default tree
            }
        }

        // Return a default tree if parsing failed
        return new TreeStructure
        {
            Goal = goalName,
            Created = DateTimeOffset.UtcNow,
            LastUpdated = DateTimeOffset.UtcNow,
            MaxConcepts = 100,
            TotalConcepts = 1,
            Tree = new Dictionary<string, ConceptNode>
            {
                ["introduction"] = new ConceptNode
                {
                    Name = $"Introduction to {goalName}",
                    Status = ConceptStatus.NotStarted,
                    Tags = ConceptTag.None,
                    Children = ImmutableArray<string>.Empty,
                    Overview = $"Getting started with {goalName}",
                    Sources = ImmutableArray<ConceptSource>.Empty
                }
            }.ToImmutableDictionary()
        };
    }

    private static string? GetParentPath(string? path)
    {
        if (string.IsNullOrEmpty(path))
            return null;

        var lastSlash = path.LastIndexOf('/');
        return lastSlash > 0 ? path.Substring(0, lastSlash) : null;
    }

    private static string EscapeForCli(string input)
    {
        return input
            .Replace("\\", "\\\\")
            .Replace("\"", "\\\"")
            .Replace("\n", "\\n")
            .Replace("\r", "\\r");
    }

    // Helper class for parsing tree generation output
    private sealed class TreeGenerationOutput
    {
        public string? Goal { get; set; }
        public List<ConceptOutput>? Concepts { get; set; }
    }

    private sealed class ConceptOutput
    {
        public string? Path { get; set; }
        public string? Name { get; set; }
        public string? Overview { get; set; }
        public List<string>? Children { get; set; }
    }
}
