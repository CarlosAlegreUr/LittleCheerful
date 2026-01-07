#nullable enable

using LittleCheerful.Api.Configuration;
using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Models;
using Microsoft.Extensions.Options;

namespace LittleCheerful.Api.Services;

/// <summary>
/// Manages the user's learning profile and preferences.
/// </summary>
public sealed class ProfileService : IProfileService
{
    private readonly IFileStateService _fileStateService;
    private readonly LittleCheerfulOptions _options;
    private readonly ILogger<ProfileService> _logger;

    public ProfileService(
        IFileStateService fileStateService,
        IOptions<LittleCheerfulOptions> options,
        ILogger<ProfileService> logger)
    {
        _fileStateService = fileStateService;
        _options = options.Value;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<LearningProfile?> GetProfileAsync(CancellationToken ct)
    {
        _logger.LogInformation("Getting learning profile");
        return await _fileStateService.ReadProfileAsync(ct);
    }

    /// <inheritdoc />
    public async Task<LearningProfile> SaveProfileAsync(LearningProfile profile, CancellationToken ct)
    {
        _logger.LogInformation("Saving learning profile");

        // Update LastUpdated timestamp
        var updatedProfile = profile with
        {
            LastUpdated = DateTimeOffset.UtcNow
        };

        await _fileStateService.WriteProfileAsync(updatedProfile, ct);
        return updatedProfile;
    }

    /// <inheritdoc />
    public async Task<bool> ProfileExistsAsync(CancellationToken ct)
    {
        var profile = await _fileStateService.ReadProfileAsync(ct);
        return profile != null;
    }
}
