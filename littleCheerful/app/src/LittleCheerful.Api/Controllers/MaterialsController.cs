#nullable enable

using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Models;
using Microsoft.AspNetCore.Mvc;

namespace LittleCheerful.Api.Controllers;

/// <summary>
/// Controller for study materials management.
/// </summary>
[ApiController]
[Route("api/materials")]
public sealed class MaterialsController : ControllerBase
{
    private readonly IStudyMaterialsService _materialsService;
    private readonly ILogger<MaterialsController> _logger;

    public MaterialsController(IStudyMaterialsService materialsService, ILogger<MaterialsController> logger)
    {
        _materialsService = materialsService;
        _logger = logger;
    }

    /// <summary>
    /// Uploads a study material file.
    /// </summary>
    /// <param name="goalName">The learning goal to associate with.</param>
    /// <param name="file">The file to upload.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The created study material record.</returns>
    [HttpPost("{goalName}/upload")]
    [ProducesResponseType(typeof(StudyMaterial), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<StudyMaterial>> UploadMaterial(
        string goalName,
        IFormFile file,
        CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file provided");
        }

        if (string.IsNullOrWhiteSpace(goalName))
        {
            return BadRequest("Goal name is required");
        }

        _logger.LogInformation("Uploading material {FileName} for goal: {Goal}", file.FileName, goalName);

        using var stream = file.OpenReadStream();
        var material = await _materialsService.UploadMaterialAsync(stream, file.FileName, goalName, ct);

        return CreatedAtAction(nameof(GetMaterials), new { goalName }, material);
    }

    /// <summary>
    /// Gets all study materials for a learning goal.
    /// </summary>
    /// <param name="goalName">The learning goal to get materials for.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The collection of study materials.</returns>
    [HttpGet("{goalName}")]
    [ProducesResponseType(typeof(IEnumerable<StudyMaterial>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<StudyMaterial>>> GetMaterials(
        string goalName,
        CancellationToken ct)
    {
        _logger.LogInformation("Getting materials for goal: {Goal}", goalName);

        var materials = await _materialsService.GetMaterialsAsync(goalName, ct);
        return Ok(materials);
    }

    /// <summary>
    /// Deletes a study material.
    /// </summary>
    /// <param name="goalName">The learning goal (not used but required for route consistency).</param>
    /// <param name="materialId">The unique identifier of the material to delete.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>No content on success.</returns>
    [HttpDelete("{goalName}/{materialId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteMaterial(
        string goalName,
        string materialId,
        CancellationToken ct)
    {
        _logger.LogInformation("Deleting material {MaterialId}", materialId);

        await _materialsService.DeleteMaterialAsync(materialId, ct);
        return NoContent();
    }
}
