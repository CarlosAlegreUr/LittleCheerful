#nullable enable

namespace LittleCheerful.Contracts.Enums;

/// <summary>
/// Represents the learning status of a concept in the knowledge tree.
/// </summary>
public enum ConceptStatus
{
    /// <summary>
    /// The concept has not been started yet.
    /// </summary>
    NotStarted = 0,

    /// <summary>
    /// The concept is currently being learned.
    /// </summary>
    InProgress = 1,

    /// <summary>
    /// The concept has been studied and mastered.
    /// </summary>
    Studied = 2
}
