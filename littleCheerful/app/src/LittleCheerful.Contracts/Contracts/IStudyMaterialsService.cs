#nullable enable

using LittleCheerful.Contracts.Models;

namespace LittleCheerful.Contracts.Contracts;

/// <summary>
/// Manages study materials uploaded by the user.
/// </summary>
public interface IStudyMaterialsService
{
    /// <summary>
    /// Uploads a study material file for a learning goal.
    /// </summary>
    /// <param name="fileStream">The file content stream.</param>
    /// <param name="fileName">The original file name.</param>
    /// <param name="goalName">The learning goal to associate with.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The created study material record.</returns>
    Task<StudyMaterial> UploadMaterialAsync(Stream fileStream, string fileName, string goalName, CancellationToken ct);

    /// <summary>
    /// Gets all study materials for a learning goal.
    /// </summary>
    /// <param name="goalName">The learning goal to get materials for.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The collection of study materials.</returns>
    Task<IEnumerable<StudyMaterial>> GetMaterialsAsync(string goalName, CancellationToken ct);

    /// <summary>
    /// Deletes a study material.
    /// </summary>
    /// <param name="materialId">The unique identifier of the material to delete.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>A task representing the delete operation.</returns>
    Task DeleteMaterialAsync(string materialId, CancellationToken ct);
}
