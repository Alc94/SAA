namespace ZooLogic.Api.Models;

/// <summary>Individuo del parque. Es el "gemelo digital" sobre el que se acumulan los registros.</summary>
public class Animal
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    /// <summary>Código único del microchip o del identificador de sensor.</summary>
    public string TagCode { get; set; } = string.Empty;

    public int SpeciesId { get; set; }
    public Species? Species { get; set; }

    public string Sex { get; set; } = "Desconocido";
    public DateOnly? BirthDate { get; set; }
    public decimal WeightKg { get; set; }
    public string Enclosure { get; set; } = string.Empty;

    /// <summary>Saludable, En observación o Crítico.</summary>
    public string HealthStatus { get; set; } = "Saludable";

    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<VetRecord> Records { get; set; } = new();
}
