#nullable enable

namespace LittleCheerful.Api.Configuration;

/// <summary>
/// Configuration options for Little Cheerful API.
/// </summary>
public sealed class LittleCheerfulOptions
{
    /// <summary>
    /// Configuration section name.
    /// </summary>
    public const string SectionName = "LittleCheerful";

    /// <summary>
    /// Gets or sets the base path for Claude state files.
    /// </summary>
    public string ClaudeBasePath { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the path to the Claude CLI executable.
    /// </summary>
    public string ClaudeCliPath { get; set; } = "claude";

    /// <summary>
    /// Gets or sets the default timeout in seconds for Claude CLI operations.
    /// </summary>
    public int DefaultTimeoutSeconds { get; set; } = 120;

    /// <summary>
    /// Gets or sets the timeout in seconds for tree generation operations.
    /// </summary>
    public int TreeGenerationTimeoutSeconds { get; set; } = 300;
}
