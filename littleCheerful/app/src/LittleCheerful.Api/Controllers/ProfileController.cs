#nullable enable

using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Models;
using Microsoft.AspNetCore.Mvc;

namespace LittleCheerful.Api.Controllers;

/// <summary>
/// Controller for learning profile management.
/// </summary>
[ApiController]
[Route("api/profile")]
public sealed class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(IProfileService profileService, ILogger<ProfileController> logger)
    {
        _profileService = profileService;
        _logger = logger;
    }

    /// <summary>
    /// Gets the current learning profile.
    /// </summary>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The learning profile, or null if not yet created.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(LearningProfile), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LearningProfile>> GetProfile(CancellationToken ct)
    {
        _logger.LogInformation("Getting learning profile");

        var profile = await _profileService.GetProfileAsync(ct);

        if (profile == null)
        {
            return NotFound();
        }

        return Ok(profile);
    }

    /// <summary>
    /// Saves or updates the learning profile.
    /// </summary>
    /// <param name="profile">The profile to save.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The saved profile.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(LearningProfile), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LearningProfile>> SaveProfile(
        [FromBody] LearningProfile profile,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(profile.PreferredLanguage))
        {
            return BadRequest("Preferred language is required");
        }

        if (profile.SourceDepth < 1 || profile.SourceDepth > 4)
        {
            return BadRequest("Source depth must be between 1 and 4");
        }

        _logger.LogInformation("Saving learning profile");

        var savedProfile = await _profileService.SaveProfileAsync(profile, ct);
        return Ok(savedProfile);
    }

    /// <summary>
    /// Checks whether a learning profile exists.
    /// </summary>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>True if a profile exists, false otherwise.</returns>
    [HttpGet("exists")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    public async Task<ActionResult<bool>> ProfileExists(CancellationToken ct)
    {
        _logger.LogInformation("Checking if profile exists");

        var exists = await _profileService.ProfileExistsAsync(ct);
        return Ok(exists);
    }
}
