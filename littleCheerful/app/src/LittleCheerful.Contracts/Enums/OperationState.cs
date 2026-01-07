#nullable enable

namespace LittleCheerful.Contracts.Enums;

/// <summary>
/// Represents the state of a long-running operation.
/// </summary>
public enum OperationState
{
    /// <summary>
    /// The operation is queued and waiting to start.
    /// </summary>
    Queued = 0,

    /// <summary>
    /// The operation is currently running.
    /// </summary>
    Running = 1,

    /// <summary>
    /// The operation completed successfully.
    /// </summary>
    Completed = 2,

    /// <summary>
    /// The operation failed.
    /// </summary>
    Failed = 3
}
