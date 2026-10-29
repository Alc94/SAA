using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooLogic.Api.Data;
using ZooLogic.Api.Dtos;
using ZooLogic.Api.Models;

namespace ZooLogic.Api.Controllers;

/// <summary>Registros de seguimiento veterinario de cada animal.</summary>
[ApiController]
[Route("api")]
public class VetRecordsController(AppDbContext db) : ControllerBase
{
    private const decimal AnomalyThreshold = 0.6m;

    // GET api/animals/5/records
    [HttpGet("animals/{animalId:int}/records")]
    public async Task<ActionResult<IEnumerable<VetRecordDto>>> ByAnimal(int animalId)
    {
        if (!await db.Animals.AnyAsync(a => a.Id == animalId)) return NotFound();

        var items = await db.VetRecords.AsNoTracking()
            .Where(r => r.AnimalId == animalId)
            .OrderByDescending(r => r.RecordDate)
            .ToListAsync();

        return Ok(items.Select(r => r.ToDto()));
    }

    // POST api/animals/5/records
    [HttpPost("animals/{animalId:int}/records")]
    public async Task<ActionResult<VetRecordDto>> Create(int animalId, VetRecordWriteDto dto)
    {
        var animal = await db.Animals.FindAsync(animalId);
        if (animal is null) return NotFound();

        var record = new VetRecord
        {
            AnimalId = animalId,
            RecordDate = (dto.RecordDate ?? DateTime.UtcNow).ToUtc(),
            RecordType = dto.RecordType.Trim(),
            Description = dto.Description.Trim(),
            TemperatureC = dto.TemperatureC,
            HeartRateBpm = dto.HeartRateBpm,
            Source = dto.Source,
            AnomalyScore = dto.AnomalyScore,
            Veterinarian = dto.Veterinarian.Trim(),
            ValidatedByExpert = false
        };

        // Regla de negocio: una anomalía alta en un animal sano lo pasa a "En observación".
        if (record.AnomalyScore >= AnomalyThreshold && animal.HealthStatus == "Saludable")
            animal.HealthStatus = "En observación";

        db.VetRecords.Add(record);
        await db.SaveChangesAsync();

        return Created($"/api/records/{record.Id}", record.ToDto());
    }

    // PUT api/records/7/validate  (validación continua por un experto humano)
    [HttpPut("records/{id:int}/validate")]
    public async Task<ActionResult<VetRecordDto>> Validate(int id)
    {
        var record = await db.VetRecords.FindAsync(id);
        if (record is null) return NotFound();

        record.ValidatedByExpert = true;
        await db.SaveChangesAsync();
        return Ok(record.ToDto());
    }

    // DELETE api/records/7
    [HttpDelete("records/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var record = await db.VetRecords.FindAsync(id);
        if (record is null) return NotFound();

        db.VetRecords.Remove(record);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
