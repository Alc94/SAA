using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooLogic.Api.Data;
using ZooLogic.Api.Dtos;
using ZooLogic.Api.Models;

namespace ZooLogic.Api.Controllers;

/// <summary>CRUD completo de animales (gemelos digitales).</summary>
[ApiController]
[Route("api/[controller]")]
public class AnimalsController(AppDbContext db) : ControllerBase
{
    // GET api/animals?search=leon&status=Crítico
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AnimalDto>>> GetAll([FromQuery] string? search, [FromQuery] string? status)
    {
        var query = db.Animals.AsNoTracking().Include(a => a.Species).AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(a => a.HealthStatus == status);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = $"%{search.Trim()}%";
            query = query.Where(a =>
                EF.Functions.ILike(a.Name, term) ||
                EF.Functions.ILike(a.TagCode, term) ||
                EF.Functions.ILike(a.Enclosure, term) ||
                EF.Functions.ILike(a.Species!.CommonName, term));
        }

        var items = await query.OrderBy(a => a.Name).ToListAsync();
        return Ok(items.Select(a => a.ToDto()));
    }

    // GET api/animals/stats
    [HttpGet("stats")]
    public async Task<ActionResult<AnimalStatsDto>> Stats()
    {
        var groups = await db.Animals
            .GroupBy(a => a.HealthStatus)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        int Count(string status) => groups.FirstOrDefault(g => g.Status == status)?.Count ?? 0;

        var pending = await db.VetRecords.CountAsync(r => r.AnomalyScore >= 0.6m && !r.ValidatedByExpert);

        return Ok(new AnimalStatsDto(
            groups.Sum(g => g.Count), Count("Saludable"), Count("En observación"), Count("Crítico"), pending));
    }

    // GET api/animals/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AnimalDto>> GetById(int id)
    {
        var animal = await db.Animals.AsNoTracking().Include(a => a.Species).FirstOrDefaultAsync(a => a.Id == id);
        return animal is null ? NotFound() : Ok(animal.ToDto());
    }

    // POST api/animals
    [HttpPost]
    public async Task<ActionResult<AnimalDto>> Create(AnimalWriteDto dto)
    {
        if (!await db.Species.AnyAsync(s => s.Id == dto.SpeciesId))
            return BadRequest(new { message = "La especie indicada no existe." });

        var tag = dto.TagCode.Trim().ToUpperInvariant();
        if (await db.Animals.AnyAsync(a => a.TagCode == tag))
            return Conflict(new { message = $"Ya existe un animal con el código '{tag}'." });

        var animal = new Animal { CreatedAt = DateTime.UtcNow };
        Apply(animal, dto);

        db.Animals.Add(animal);
        await db.SaveChangesAsync();
        await db.Entry(animal).Reference(a => a.Species).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = animal.Id }, animal.ToDto());
    }

    // PUT api/animals/5
    [HttpPut("{id:int}")]
    public async Task<ActionResult<AnimalDto>> Update(int id, AnimalWriteDto dto)
    {
        var animal = await db.Animals.FindAsync(id);
        if (animal is null) return NotFound();

        if (!await db.Species.AnyAsync(s => s.Id == dto.SpeciesId))
            return BadRequest(new { message = "La especie indicada no existe." });

        var tag = dto.TagCode.Trim().ToUpperInvariant();
        if (await db.Animals.AnyAsync(a => a.TagCode == tag && a.Id != id))
            return Conflict(new { message = $"Ya existe otro animal con el código '{tag}'." });

        Apply(animal, dto);
        await db.SaveChangesAsync();
        await db.Entry(animal).Reference(a => a.Species).LoadAsync();

        return Ok(animal.ToDto());
    }

    // DELETE api/animals/5  (elimina también sus registros de seguimiento)
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var animal = await db.Animals.FindAsync(id);
        if (animal is null) return NotFound();

        db.Animals.Remove(animal);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(Animal animal, AnimalWriteDto dto)
    {
        animal.Name = dto.Name.Trim();
        animal.TagCode = dto.TagCode.Trim().ToUpperInvariant();
        animal.SpeciesId = dto.SpeciesId;
        animal.Sex = dto.Sex;
        animal.BirthDate = dto.BirthDate;
        animal.WeightKg = dto.WeightKg;
        animal.Enclosure = dto.Enclosure.Trim();
        animal.HealthStatus = dto.HealthStatus;
        animal.Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim();
    }
}
