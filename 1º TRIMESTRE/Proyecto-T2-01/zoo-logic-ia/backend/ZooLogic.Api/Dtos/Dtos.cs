using System.ComponentModel.DataAnnotations;

namespace ZooLogic.Api.Dtos;

public record SpeciesDto(
    int Id,
    string CommonName,
    string ScientificName,
    string ConservationStatus,
    string Habitat,
    string Diet,
    string EducationalFact);

public record AnimalDto(
    int Id,
    string Name,
    string TagCode,
    int SpeciesId,
    string SpeciesName,
    string Sex,
    DateOnly? BirthDate,
    decimal WeightKg,
    string Enclosure,
    string HealthStatus,
    string? Notes,
    DateTime CreatedAt);

public record AnimalStatsDto(
    int Total,
    int Healthy,
    int Observation,
    int Critical,
    int PendingValidation);

public class AnimalWriteDto
{
    [Required, StringLength(80)]
    public string Name { get; set; } = string.Empty;

    [Required, StringLength(40)]
    public string TagCode { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Selecciona una especie.")]
    public int SpeciesId { get; set; }

    [Required, RegularExpression("^(Macho|Hembra|Desconocido)$", ErrorMessage = "Sexo no válido.")]
    public string Sex { get; set; } = "Desconocido";

    public DateOnly? BirthDate { get; set; }

    [Range(0, 100000)]
    public decimal WeightKg { get; set; }

    [Required, StringLength(80)]
    public string Enclosure { get; set; } = string.Empty;

    [Required, RegularExpression("^(Saludable|En observación|Crítico)$", ErrorMessage = "Estado de salud no válido.")]
    public string HealthStatus { get; set; } = "Saludable";

    [StringLength(1000)]
    public string? Notes { get; set; }
}

public record VetRecordDto(
    int Id,
    int AnimalId,
    DateTime RecordDate,
    string RecordType,
    string Description,
    decimal? TemperatureC,
    int? HeartRateBpm,
    string Source,
    decimal? AnomalyScore,
    string Veterinarian,
    bool ValidatedByExpert);

public class VetRecordWriteDto
{
    public DateTime? RecordDate { get; set; }

    [Required, StringLength(30)]
    public string RecordType { get; set; } = "Revisión";

    [Required, StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Range(20, 50)]
    public decimal? TemperatureC { get; set; }

    [Range(1, 600)]
    public int? HeartRateBpm { get; set; }

    [Required, RegularExpression("^(Veterinario|IoT|Visión|IA)$", ErrorMessage = "Origen no válido.")]
    public string Source { get; set; } = "Veterinario";

    [Range(0, 1)]
    public decimal? AnomalyScore { get; set; }

    [Required, StringLength(80)]
    public string Veterinarian { get; set; } = string.Empty;
}

public class ChatRequest
{
    [Required, StringLength(300)]
    public string Question { get; set; } = string.Empty;
}

public record ChatResponse(string Answer, string? Species, IEnumerable<string> Suggestions);
