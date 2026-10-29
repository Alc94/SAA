using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooLogic.Api.Data;
using ZooLogic.Api.Dtos;

namespace ZooLogic.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpeciesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SpeciesDto>>> GetAll()
    {
        var items = await db.Species.AsNoTracking().OrderBy(s => s.CommonName).ToListAsync();
        return Ok(items.Select(s => s.ToDto()));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SpeciesDto>> GetById(int id)
    {
        var species = await db.Species.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
        return species is null ? NotFound() : Ok(species.ToDto());
    }
}
