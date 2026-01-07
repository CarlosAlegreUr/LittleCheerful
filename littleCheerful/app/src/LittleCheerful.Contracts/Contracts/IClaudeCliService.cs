#nullable enable

using LittleCheerful.Contracts.Models;

namespace LittleCheerful.Contracts.Contracts;

/// <summary>
/// Executes Claude CLI commands for AI-powered operations.
/// This is an internal API service, not exposed to clients.
/// </summary>
public interface IClaudeCliService
{
    /// <summary>
    /// Executes a Claude CLI command.
    /// </summary>
    /// <param name="command">The command to execute.</param>
    /// <param name="input">Optional input to pass to the command.</param>
    /// <param name="progress">Optional progress reporter for streaming output.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The response from the Claude CLI.</returns>
    Task<ClaudeResponse> ExecuteAsync(
        string command,
        string? input,
        IProgress<string>? progress,
        CancellationToken ct);

    /// <summary>
    /// Executes a Claude CLI command with a specific timeout.
    /// </summary>
    /// <param name="command">The command to execute.</param>
    /// <param name="input">Optional input to pass to the command.</param>
    /// <param name="timeout">The maximum time to wait for completion.</param>
    /// <param name="progress">Optional progress reporter for streaming output.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The response from the Claude CLI.</returns>
    Task<ClaudeResponse> ExecuteWithTimeoutAsync(
        string command,
        string? input,
        TimeSpan timeout,
        IProgress<string>? progress,
        CancellationToken ct);
}
