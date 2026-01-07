#nullable enable

namespace LittleCheerful.Contracts.Enums;

/// <summary>
/// Represents the teaching tone preference for the learning profile.
/// </summary>
public enum TeachingTone
{
    /// <summary>
    /// Encouraging, gentle corrections, positive reinforcement.
    /// </summary>
    Nice = 0,

    /// <summary>
    /// Blunt, clear corrections, truth over feelings.
    /// </summary>
    Direct = 1,

    /// <summary>
    /// Mix of both as appropriate.
    /// </summary>
    Balanced = 2,

    /// <summary>
    /// Custom communication style specified by the user.
    /// </summary>
    Other = 3
}
