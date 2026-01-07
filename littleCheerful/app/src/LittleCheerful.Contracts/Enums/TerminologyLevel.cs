#nullable enable

namespace LittleCheerful.Contracts.Enums;

/// <summary>
/// Represents the terminology level preference for explanations.
/// </summary>
public enum TerminologyLevel
{
    /// <summary>
    /// Everyday language, minimal jargon.
    /// </summary>
    Casual = 0,

    /// <summary>
    /// Formal terminology, precise definitions.
    /// </summary>
    Academic = 1,

    /// <summary>
    /// Match the user's language in questions.
    /// </summary>
    Adaptive = 2
}
