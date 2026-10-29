namespace ZooLogic.Api.Models;

/// <summary>
/// Registro de seguimiento. Puede venir de un veterinario, de un sensor IoT,
/// de la visión computacional o del modelo de IA.
/// </summary>
public class VetRecord
{
    public int Id { get; set; }
    public int AnimalId { get; set; }
    public Animal? Animal { get; set; }

    public DateTime RecordDate { get; set; } = DateTime.UtcNow;

    /// <summary>Revisión, Vacunación, Tratamiento, Alerta IA...</summary>
    public string RecordType { get; set; } = "Revisión";

    public string Description { get; set; } = string.Empty;
    public decimal? TemperatureC { get; set; }
    public int? HeartRateBpm { get; set; }

    /// <summary>Veterinario, IoT, Visión o IA.</summary>
    public string Source { get; set; } = "Veterinario";

    /// <summary>Puntuación de anomalía entre 0 (normal) y 1 (muy anómalo).</summary>
    public decimal? AnomalyScore { get; set; }

    public string Veterinarian { get; set; } = string.Empty;

    /// <summary>Indica que un experto humano ha revisado y confirmado el registro.</summary>
    public bool ValidatedByExpert { get; set; }
}
