#nullable enable

using System.Text;
using System.Text.Json;
using LittleCheerful.Api.Configuration;
using LittleCheerful.Contracts.Contracts;
using LittleCheerful.Contracts.Models;
using Microsoft.Extensions.Options;
using UglyToad.PdfPig;

namespace LittleCheerful.Api.Services;

/// <summary>
/// Manages study materials uploaded by the user.
/// </summary>
public sealed class StudyMaterialsService : IStudyMaterialsService
{
    private readonly LittleCheerfulOptions _options;
    private readonly ILogger<StudyMaterialsService> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public StudyMaterialsService(
        IOptions<LittleCheerfulOptions> options,
        ILogger<StudyMaterialsService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<StudyMaterial> UploadMaterialAsync(
        Stream fileStream,
        string fileName,
        string goalName,
        CancellationToken ct)
    {
        _logger.LogInformation("Uploading material {FileName} for goal {Goal}", fileName, goalName);

        var materialId = Guid.NewGuid().ToString("N");
        var materialsDir = GetMaterialsDirectory(goalName);

        if (!Directory.Exists(materialsDir))
        {
            Directory.CreateDirectory(materialsDir);
        }

        // Save the file
        var filePath = Path.Combine(materialsDir, $"{materialId}_{fileName}");
        using (var fileOutputStream = File.Create(filePath))
        {
            await fileStream.CopyToAsync(fileOutputStream, ct);
        }

        // Extract text content if possible
        string? extractedText = null;
        var extension = Path.GetExtension(fileName).ToLowerInvariant();

        if (extension == ".pdf")
        {
            extractedText = ExtractTextFromPdf(filePath);
        }
        else if (extension == ".txt" || extension == ".md")
        {
            extractedText = await File.ReadAllTextAsync(filePath, ct);
        }

        var material = new StudyMaterial
        {
            Id = materialId,
            FileName = fileName,
            GoalName = goalName,
            UploadedAt = DateTimeOffset.UtcNow,
            FilePath = filePath,
            ExtractedText = extractedText
        };

        // Update materials index
        await AddToMaterialsIndexAsync(goalName, material, ct);

        return material;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<StudyMaterial>> GetMaterialsAsync(string goalName, CancellationToken ct)
    {
        _logger.LogInformation("Getting materials for goal {Goal}", goalName);

        var indexPath = GetMaterialsIndexPath(goalName);

        if (!File.Exists(indexPath))
        {
            return Array.Empty<StudyMaterial>();
        }

        var json = await File.ReadAllTextAsync(indexPath, ct);
        var materials = JsonSerializer.Deserialize<List<StudyMaterial>>(json, JsonOptions);

        return materials ?? new List<StudyMaterial>();
    }

    /// <inheritdoc />
    public async Task DeleteMaterialAsync(string materialId, CancellationToken ct)
    {
        _logger.LogInformation("Deleting material {MaterialId}", materialId);

        // Find the material in all goals
        var claudeDir = Path.Combine(_options.ClaudeBasePath, ".claude", "materials");

        if (!Directory.Exists(claudeDir))
        {
            return;
        }

        foreach (var goalDir in Directory.GetDirectories(claudeDir))
        {
            var goalName = Path.GetFileName(goalDir);
            var materials = (await GetMaterialsAsync(goalName, ct)).ToList();

            var material = materials.FirstOrDefault(m => m.Id == materialId);
            if (material != null)
            {
                // Delete the file
                if (File.Exists(material.FilePath))
                {
                    File.Delete(material.FilePath);
                }

                // Update index
                materials.Remove(material);
                await SaveMaterialsIndexAsync(goalName, materials, ct);

                _logger.LogInformation("Material {MaterialId} deleted from goal {Goal}", materialId, goalName);
                return;
            }
        }

        _logger.LogWarning("Material {MaterialId} not found", materialId);
    }

    private string GetMaterialsDirectory(string goalName)
    {
        return Path.Combine(_options.ClaudeBasePath, ".claude", "materials", goalName);
    }

    private string GetMaterialsIndexPath(string goalName)
    {
        return Path.Combine(GetMaterialsDirectory(goalName), "materials.json");
    }

    private async Task AddToMaterialsIndexAsync(string goalName, StudyMaterial material, CancellationToken ct)
    {
        var materials = (await GetMaterialsAsync(goalName, ct)).ToList();
        materials.Add(material);
        await SaveMaterialsIndexAsync(goalName, materials, ct);
    }

    private async Task SaveMaterialsIndexAsync(string goalName, IEnumerable<StudyMaterial> materials, CancellationToken ct)
    {
        var indexPath = GetMaterialsIndexPath(goalName);
        var directory = Path.GetDirectoryName(indexPath);

        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        var json = JsonSerializer.Serialize(materials.ToList(), JsonOptions);
        await File.WriteAllTextAsync(indexPath, json, ct);
    }

    private string? ExtractTextFromPdf(string filePath)
    {
        try
        {
            var sb = new StringBuilder();

            using (var document = PdfDocument.Open(filePath))
            {
                foreach (var page in document.GetPages())
                {
                    sb.AppendLine(page.Text);
                }
            }

            return sb.ToString();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to extract text from PDF: {FilePath}", filePath);
            return null;
        }
    }
}
