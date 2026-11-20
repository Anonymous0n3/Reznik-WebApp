using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reznik_WebApp.Server.Models;

namespace Reznik_WebApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LittersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LittersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLitters()
        {
            var litters = await _context.Litters
                .Include(l => l.Sire)
                    .ThenInclude(s => s.Images) // ZMĚNA: Načtení fotek otce
                .Include(l => l.Dam)
                    .ThenInclude(d => d.Images) // ZMĚNA: Načtení fotek matky
                .ToListAsync();

            return Ok(litters);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLitter(int id)
        {
            var litter = await _context.Litters
                .Include(l => l.Sire)
                    .ThenInclude(s => s.Images) // ZMĚNA: Načtení fotek otce
                .Include(l => l.Dam)
                    .ThenInclude(d => d.Images) // ZMĚNA: Načtení fotek matky
                .FirstOrDefaultAsync(l => l.Id == id);

            if (litter == null)
            {
                return NotFound("Vrh nebyl nalezen.");
            }

            return Ok(litter);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateLitter([FromBody] Litter litter)
        {
            litter.Sire = null;
            litter.Dam = null;

            _context.Litters.Add(litter);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLitter), new { id = litter.Id }, litter);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLitter(int id, [FromBody] Litter updatedLitter)
        {
            if (id != updatedLitter.Id)
            {
                return BadRequest("ID vrhu nesouhlasí.");
            }

            var existingLitter = await _context.Litters.FindAsync(id);
            if (existingLitter == null)
            {
                return NotFound("Vrh neexistuje.");
            }

            existingLitter.Status = updatedLitter.Status;
            existingLitter.ExpectedDate = updatedLitter.ExpectedDate;
            existingLitter.ExpectedCount = updatedLitter.ExpectedCount;
            existingLitter.Description = updatedLitter.Description;
            existingLitter.SireId = updatedLitter.SireId;
            existingLitter.DamId = updatedLitter.DamId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLitter(int id)
        {
            var litter = await _context.Litters.FindAsync(id);
            if (litter == null)
            {
                return NotFound("Vrh neexistuje.");
            }

            _context.Litters.Remove(litter);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}