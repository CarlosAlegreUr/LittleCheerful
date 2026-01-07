#nullable enable

namespace LittleCheerful.Contracts.Enums;

/// <summary>
/// Represents mastery tags that can be applied to a concept.
/// </summary>
[Flags]
public enum ConceptTag
{
    /// <summary>
    /// No tags applied.
    /// </summary>
    None = 0,

    /// <summary>
    /// Can explain the concept in simple, intuitive terms.
    /// </summary>
    Intuitive = 1,

    /// <summary>
    /// Understands the precise, formal definition of the concept.
    /// </summary>
    Formal = 2,

    /// <summary>
    /// Can apply the concept to solve real problems.
    /// </summary>
    CanApply = 4
}
