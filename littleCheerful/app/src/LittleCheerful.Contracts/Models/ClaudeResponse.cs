#nullable enable

using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents a response from the Claude CLI execution.
/// </summary>
public sealed record ClaudeResponse
{
    /// <summary>
    /// Gets a value indicating whether the command executed successfully.
    /// </summary>
    [JsonPropertyName("success")]
    public required bool Success { get; init; }

    /// <summary>
    /// Gets the output from the Claude CLI.
    /// </summary>
    [JsonPropertyName("output")]
    public required string Output { get; init; }

    /// <summary>
    /// Gets the error message if the command failed.
    /// </summary>
    [JsonPropertyName("errorMessage")]
    public string? ErrorMessage { get; init; }
}
