#nullable enable

using LittleCheerful.Contracts.Models;

namespace LittleCheerful.Contracts.Contracts;

/// <summary>
/// Manages the learning tree structure and concept navigation.
/// </summary>
public interface ITreeService
{
    /// <summary>
    /// Gets the current tree structure for a learning goal.
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The tree structure for the goal.</returns>
    Task<TreeStructure> GetCurrentTreeAsync(string goalName, CancellationToken ct);

    /// <summary>
    /// Generates a new learning tree for a goal using AI.
    /// </summary>
    /// <param name="request">The tree generation request.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The operation status for tracking the long-running generation.</returns>
    /// <remarks>
    /// Tree generation is a long-running operation as it involves AI processing.
    /// Poll the returned OperationStatus to track progress.
    /// </remarks>
    Task<OperationStatus> GenerateTreeAsync(TreeGenerationRequest request, CancellationToken ct);

    /// <summary>
    /// Gets a specific concept from the learning tree.
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="conceptPath">The path to the concept in the tree.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The concept node with full details.</returns>
    Task<ConceptNode> GetConceptAsync(string goalName, string conceptPath, CancellationToken ct);

    /// <summary>
    /// Navigates to a specific concept, updating the learning progress.
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="conceptPath">The path to the concept to navigate to.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>A task representing the navigation operation.</returns>
    /// <remarks>
    /// Navigation may update concept status and trigger AI to prepare context.
    /// </remarks>
    Task NavigateToConceptAsync(string goalName, string conceptPath, CancellationToken ct);
}
