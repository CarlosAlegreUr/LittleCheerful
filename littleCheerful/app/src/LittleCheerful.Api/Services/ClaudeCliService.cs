#nullable enable

using System.Diagnostics;
using System.Text;
using LittleCheerful.Api.Configuration;
using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Models;
using Microsoft.Extensions.Options;

namespace LittleCheerful.Api.Services;

/// <summary>
/// Executes Claude CLI commands for AI-powered operations.
/// </summary>
public sealed class ClaudeCliService : IClaudeCliService
{
    private readonly LittleCheerfulOptions _options;
    private readonly ILogger<ClaudeCliService> _logger;
    private readonly SemaphoreSlim _semaphore = new(1, 1);

    public ClaudeCliService(
        IOptions<LittleCheerfulOptions> options,
        ILogger<ClaudeCliService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    /// <inheritdoc />
    public Task<ClaudeResponse> ExecuteAsync(
        string command,
        string? input,
        IProgress<string>? progress,
        CancellationToken ct)
    {
        return ExecuteWithTimeoutAsync(
            command,
            input,
            TimeSpan.FromSeconds(_options.DefaultTimeoutSeconds),
            progress,
            ct);
    }

    /// <inheritdoc />
    public async Task<ClaudeResponse> ExecuteWithTimeoutAsync(
        string command,
        string? input,
        TimeSpan timeout,
        IProgress<string>? progress,
        CancellationToken ct)
    {
        await _semaphore.WaitAsync(ct);

        try
        {
            _logger.LogInformation("Executing Claude CLI command: {Command}", command);

            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(timeout);

            var startInfo = new ProcessStartInfo
            {
                FileName = _options.ClaudeCliPath,
                Arguments = command,
                WorkingDirectory = _options.ClaudeBasePath,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                RedirectStandardInput = input != null,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = new Process { StartInfo = startInfo };
            var outputBuilder = new StringBuilder();
            var errorBuilder = new StringBuilder();

            process.OutputDataReceived += (_, e) =>
            {
                if (e.Data != null)
                {
                    outputBuilder.AppendLine(e.Data);
                    progress?.Report(e.Data);
                }
            };

            process.ErrorDataReceived += (_, e) =>
            {
                if (e.Data != null)
                {
                    errorBuilder.AppendLine(e.Data);
                }
            };

            process.Start();
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();

            if (input != null)
            {
                await process.StandardInput.WriteAsync(input);
                process.StandardInput.Close();
            }

            try
            {
                await process.WaitForExitAsync(cts.Token);
            }
            catch (OperationCanceledException)
            {
                try
                {
                    process.Kill(entireProcessTree: true);
                }
                catch
                {
                    // Ignore kill errors
                }

                return new ClaudeResponse
                {
                    Success = false,
                    Output = outputBuilder.ToString(),
                    ErrorMessage = ct.IsCancellationRequested
                        ? "Operation was cancelled."
                        : $"Operation timed out after {timeout.TotalSeconds} seconds."
                };
            }

            var exitCode = process.ExitCode;
            var output = outputBuilder.ToString();
            var error = errorBuilder.ToString();

            _logger.LogInformation("Claude CLI command completed with exit code: {ExitCode}", exitCode);

            return new ClaudeResponse
            {
                Success = exitCode == 0,
                Output = output,
                ErrorMessage = exitCode != 0 ? error : null
            };
        }
        finally
        {
            _semaphore.Release();
        }
    }
}
