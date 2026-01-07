#nullable enable

namespace LittleCheerful.Contracts.Enums;

/// <summary>
/// Represents the example preference for learning explanations.
/// </summary>
public enum ExamplePreference
{
    /// <summary>
    /// Prefer metaphors and comparisons.
    /// </summary>
    Analogies = 0,

    /// <summary>
    /// Prefer precise, technical definitions.
    /// </summary>
    FormalDefinitions = 1,

    /// <summary>
    /// Use both as appropriate.
    /// </summary>
    Both = 2
}
