#nullable enable

using LittleCheerful.Contracts.Models;

namespace LittleCheerful.Contracts.Contracts;

/// <summary>
/// Manages the user's learning profile and preferences.
/// </summary>
public interface IProfileService
{
    /// <summary>
    /// Gets the current learning profile.
    /// </summary>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The learning profile, or null if not yet created.</returns>
    Task<LearningProfile?> GetProfileAsync(CancellationToken ct);

    /// <summary>
    /// Saves or updates the learning profile.
    /// </summary>
    /// <param name="profile">The profile to save.</param>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>The saved profile with updated timestamps.</returns>
    Task<LearningProfile> SaveProfileAsync(LearningProfile profile, CancellationToken ct);

    /// <summary>
    /// Checks whether a learning profile exists.
    /// </summary>
    /// <param name="ct">Cancellation token to cancel the operation.</param>
    /// <returns>True if a profile exists, false otherwise.</returns>
    Task<bool> ProfileExistsAsync(CancellationToken ct);
}
