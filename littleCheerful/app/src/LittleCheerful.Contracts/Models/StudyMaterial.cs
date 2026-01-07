#nullable enable

using System.Text.Json.Serialization;

namespace LittleCheerful.Contracts.Models;

/// <summary>
/// Represents an uploaded study material file.
/// </summary>
public sealed record StudyMaterial
{
    /// <summary>
    /// Gets the unique identifier of the material.
    /// </summary>
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    /// <summary>
    /// Gets the original file name.
    /// </summary>
    [JsonPropertyName("fileName")]
    public required string FileName { get; init; }

    /// <summary>
    /// Gets the name of the associated learning goal.
    /// </summary>
    [JsonPropertyName("goalName")]
    public required string GoalName { get; init; }

    /// <summary>
    /// Gets the timestamp when the material was uploaded.
    /// </summary>
    [JsonPropertyName("uploadedAt")]
    public required DateTimeOffset UploadedAt { get; init; }

    /// <summary>
    /// Gets the storage path of the file.
    /// </summary>
    [JsonPropertyName("filePath")]
    public required string FilePath { get; init; }

    /// <summary>
    /// Gets the extracted text content from the material, if available.
    /// </summary>
    [JsonPropertyName("extractedText")]
    public string? ExtractedText { get; init; }
}
