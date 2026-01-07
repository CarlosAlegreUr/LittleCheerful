#nullable enable

namespace LittleCheerful.Contracts.Enums;

/// <summary>
/// Represents the motivation style preference for the learning profile.
/// </summary>
public enum MotivationStyle
{
    /// <summary>
    /// Celebrate wins, encourage progress.
    /// </summary>
    PositiveReinforcement = 0,

    /// <summary>
    /// Push hard, call out mistakes directly.
    /// </summary>
    ToughLove = 1,

    /// <summary>
    /// Adapt based on situation.
    /// </summary>
    Balanced = 2
}
