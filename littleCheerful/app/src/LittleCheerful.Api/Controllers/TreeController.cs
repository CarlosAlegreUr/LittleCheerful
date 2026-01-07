#nullable enable

using LittleCheerful.Api.Services;
using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Models;
using Microsoft.AspNetCore.Mvc;

namespace LittleCheerful.Api.Controllers;

/// <summary>
/// Controller for learning tree management.
/// </summary>
[ApiController]
[Route("api/tree")]
public sealed class TreeController : ControllerBase
{
    private readonly ITreeService _treeService;
    private readonly ILogger<TreeController> _logger;

    public TreeController(ITreeService treeService, ILogger<TreeController> logger)
    {
        _treeService = treeService;
        _logger = logger;
    }

    /// <summary>
    /// Gets the tree structure for a learning goal.
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The tree structure.</returns>
    [HttpGet("{goalName}")]
    [ProducesResponseType(typeof(TreeStructure), StatusCodes.Status200OK)]
    public async Task<ActionResult<TreeStructure>> GetTree(string goalName, CancellationToken ct)
    {
        _logger.LogInformation("Getting tree for goal: {Goal}", goalName);

        var tree = await _treeService.GetCurrentTreeAsync(goalName, ct);
        return Ok(tree);
    }

    /// <summary>
    /// Gets a specific concept from the learning tree.
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="path">The path to the concept (can include slashes).</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The concept node.</returns>
    [HttpGet("{goalName}/concept/{*path}")]
    [ProducesResponseType(typeof(ConceptNode), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ConceptNode>> GetConcept(
        string goalName,
        string path,
        CancellationToken ct)
    {
        _logger.LogInformation("Getting concept {Path} for goal: {Goal}", path, goalName);

        var concept = await _treeService.GetConceptAsync(goalName, path, ct);
        return Ok(concept);
    }

    /// <summary>
    /// Starts tree generation for a learning goal.
    /// </summary>
    /// <param name="request">The tree generation request.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The operation status for tracking.</returns>
    [HttpPost("generate")]
    [ProducesResponseType(typeof(OperationStatus), StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OperationStatus>> GenerateTree(
        [FromBody] TreeGenerationRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.GoalName))
        {
            return BadRequest("Goal name is required");
        }

        _logger.LogInformation("Starting tree generation for goal: {Goal}", request.GoalName);

        var status = await _treeService.GenerateTreeAsync(request, ct);
        return Accepted(status);
    }

    /// <summary>
    /// Gets the status of a tree generation operation.
    /// </summary>
    /// <param name="operationId">The operation ID.</param>
    /// <returns>The operation status.</returns>
    [HttpGet("operation/{operationId}")]
    [ProducesResponseType(typeof(OperationStatus), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<OperationStatus> GetOperationStatus(string operationId)
    {
        _logger.LogInformation("Getting operation status: {OperationId}", operationId);

        var status = TreeService.GetOperationStatus(operationId);

        if (status == null)
        {
            return NotFound();
        }

        return Ok(status);
    }

    /// <summary>
    /// Navigates to a specific concept in the learning tree.
    /// </summary>
    /// <param name="goalName">The name of the learning goal.</param>
    /// <param name="path">The path to the concept.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>No content on success.</returns>
    [HttpPost("{goalName}/navigate/{*path}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> NavigateToConcept(
        string goalName,
        string path,
        CancellationToken ct)
    {
        _logger.LogInformation("Navigating to concept {Path} for goal: {Goal}", path, goalName);

        await _treeService.NavigateToConceptAsync(goalName, path, ct);
        return NoContent();
    }
}
