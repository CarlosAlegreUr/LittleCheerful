#nullable enable

using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a request to generate a new learning tree.
/// </summary>
public sealed record TreeGenerationRequest
{
    /// <summary>
    /// Gets the name of the learning goal.
    /// </summary>
    [JsonPropertyName("goalName")]
    public required string GoalName { get; init; }

    /// <summary>
    /// Gets the optional initial assessment to tailor the tree.
    /// </summary>
    [JsonPropertyName("initialAssessment")]
    public string? InitialAssessment { get; init; }
}
