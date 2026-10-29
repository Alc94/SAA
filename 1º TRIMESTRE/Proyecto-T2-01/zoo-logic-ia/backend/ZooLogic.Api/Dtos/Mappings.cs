using ZooLogic.Api.Models;

namespace ZooLogic.Api.Dtos;

public static class Mappings
{
    public static SpeciesDto ToDto(this Species s) => new(
        s.Id, s.CommonName, s.ScientificName, s.ConservationStatus, s.Habitat, s.Diet, s.EducationalFact);

    public static AnimalDto ToDto(this Animal a) => new(
        a.Id, a.Name, a.TagCode, a.SpeciesId, a.Species?.CommonName ?? string.Empty, a.Sex,
        a.BirthDate, a.WeightKg, a.Enclosure, a.HealthStatus, a.Notes, a.CreatedAt);

    public static VetRecordDto ToDto(this VetRecord r) => new(
        r.Id, r.AnimalId, r.RecordDate, r.RecordType, r.Description, r.TemperatureC,
        r.HeartRateBpm, r.Source, r.AnomalyScore, r.Veterinarian, r.ValidatedByExpert);

    /// <summary>Npgsql exige DateTime en UTC para columnas timestamptz.</summary>
    public static DateTime ToUtc(this DateTime value) => value.Kind switch
    {
        DateTimeKind.Utc => value,
        DateTimeKind.Local => value.ToUniversalTime(),
        _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
    };
}
