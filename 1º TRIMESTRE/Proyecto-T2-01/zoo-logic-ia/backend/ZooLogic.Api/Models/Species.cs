namespace ZooLogic.Api.Models;

/// <summary>Especie animal con información educativa que también consume el chatbot.</summary>
public class Species
{
    public int Id { get; set; }
    public string CommonName { get; set; } = string.Empty;
    public string ScientificName { get; set; } = string.Empty;

    /// <summary>Categoría UICN: LC, NT, VU, EN o CR.</summary>
    public string ConservationStatus { get; set; } = "LC";

    public string Habitat { get; set; } = string.Empty;
    public string Diet { get; set; } = string.Empty;
    public string EducationalFact { get; set; } = string.Empty;

    public List<Animal> Animals { get; set; } = new();
}
