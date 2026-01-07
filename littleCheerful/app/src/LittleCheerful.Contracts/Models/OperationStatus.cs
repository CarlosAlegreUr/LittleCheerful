#nullable enable

using System.Text.Json.Serialization;
using LittleCheerful.Contracts.Enums;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents the status of a long-running operation.
/// </summary>
public sealed record OperationStatus
{
    /// <summary>
    /// Gets the unique identifier of the operation.
    /// </summary>
    [JsonPropertyName("operationId")]
    public required string OperationId { get; init; }

    /// <summary>
    /// Gets the current state of the operation.
    /// </summary>
    [JsonPropertyName("state")]
    public required OperationState State { get; init; }

    /// <summary>
    /// Gets the progress percentage (0-100).
    /// </summary>
    [JsonPropertyName("progressPercent")]
    public required int ProgressPercent { get; init; }

    /// <summary>
    /// Gets the description of the current step being executed.
    /// </summary>
    [JsonPropertyName("currentStep")]
    public string? CurrentStep { get; init; }

    /// <summary>
    /// Gets the error message if the operation failed.
    /// </summary>
    [JsonPropertyName("errorMessage")]
    public string? ErrorMessage { get; init; }

    /// <summary>
    /// Gets the result of the operation if completed successfully.
    /// </summary>
    [JsonPropertyName("result")]
    public object? Result { get; init; }
}
