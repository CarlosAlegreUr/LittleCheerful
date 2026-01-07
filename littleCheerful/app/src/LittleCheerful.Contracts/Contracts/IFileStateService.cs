#nullable enable

using LittleCheerful.Contracts.Models;

namespace LittleCheerful.Contracts.Contracts;

/// <summary>
/// Manages file-based state persistence for learning data.
/// This is an internal API service for reading and writing data files.
/// </summary>
public interface IFileStateService
{
    /// <summary>
    /// Reads the tree structure for a learning goal.
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The tree structure, or null if it doesn't exist.</returns>
    Task<TreeStructure?> ReadTreeAsync(string goalName, CancellationToken ct);

    /// <summary>
    /// Writes the tree structure for a learning goal.
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="tree">The tree structure to write.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>A task representing the write operation.</returns>
    Task WriteTreeAsync(string goalName, TreeStructure tree, CancellationToken ct);

    /// <summary>
    /// Reads the learning profile.
    /// </summary>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The learning profile, or null if it doesn't exist.</returns>
    Task<LearningProfile?> ReadProfileAsync(CancellationToken ct);

    /// <summary>
    /// Writes the learning profile.
    /// </summary>
    /// <param name="profile">The profile to write.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>A task representing the write operation.</returns>
    Task WriteProfileAsync(LearningProfile profile, CancellationToken ct);

    /// <summary>
    /// Reads the content of a specific concept file.
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="conceptPath">The path to the concept.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The concept file content, or null if it doesn't exist.</returns>
    Task<string?> ReadConceptAsync(string goalName, string conceptPath, CancellationToken ct);
}
