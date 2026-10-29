using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooLogic.Data;
using ZooLogic.Models;

namespace ZooLogic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnimalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAnimals() => Ok(await _context.Animals.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> CreateAnimal(Animal animal)
        {
            _context.Animals.Add(animal);
            await _context.SaveChangesAsync();
            return Ok(animal);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animals.FindAsync(id);
            if (animal == null) return NotFound();
            _context.Animals.Remove(animal);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}