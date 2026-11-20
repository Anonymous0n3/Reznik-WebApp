using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reznik_WebApp.Server.Models;

namespace Reznik_WebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PuppiesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PuppiesController(AppDbContext context) { _context = context; }

        [HttpGet("bylitter/{litterId}")]
        public async Task<IActionResult> GetPuppiesByLitter(int litterId)
        {
            // ZMĚNA: Načítáme i pole fotek pomocí Include
            var puppies = await _context.Puppies
                .Include(p => p.Images)
                .Where(p => p.LitterId == litterId)
                .ToListAsync();

            return Ok(puppies);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePuppy([FromBody] Puppy puppy)
        {
            puppy.Litter = null;
            _context.Puppies.Add(puppy);
            await _context.SaveChangesAsync();
            return Ok(puppy);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePuppy(int id, [FromBody] Puppy updatedPuppy)
        {
            if (id != updatedPuppy.Id) return BadRequest();

            // ZMĚNA: Musíme vytáhnout i navázané fotky
            var existing = await _context.Puppies
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existing == null) return NotFound();

            existing.Name = updatedPuppy.Name;
            existing.Gender = updatedPuppy.Gender;
            existing.Status = updatedPuppy.Status;
            existing.ColorInfo = updatedPuppy.ColorInfo;

            // ZMĚNA: Přepsání starých fotek za nové
            _context.PuppyImages.RemoveRange(existing.Images);
            existing.Images = updatedPuppy.Images;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuppy(int id)
        {
            var puppy = await _context.Puppies.FindAsync(id);
            if (puppy == null) return NotFound();
            _context.Puppies.Remove(puppy);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}