using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reznik_WebApp.Server.Models;

namespace Reznik_WebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OurDogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OurDogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDogs()
        {
            // PŘIDÁNO: .Include(d => d.Images) zajistí, že se z databáze vytáhnou i navázané fotky
            var dogs = await _context.Dogs
                .Include(d => d.Images)
                .ToListAsync();

            return Ok(dogs);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddDog([FromBody] Dog newDog)
        {
            if (newDog == null)
            {
                return BadRequest("Neplatná data.");
            }

            _context.Dogs.Add(newDog);
            await _context.SaveChangesAsync();

            return Ok(newDog);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDog(int id, [FromBody] Dog updatedDog)
        {
            if (id != updatedDog.Id)
            {
                return BadRequest("ID v adrese se neshoduje s ID v zaslaných datech.");
            }

            // ZMĚNA: Místo FindAsync musíme použít FirstOrDefaultAsync s Include, 
            // abychom do paměti načetli i existující fotky, které budeme měnit
            var existingDog = await _context.Dogs
                .Include(d => d.Images)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (existingDog == null)
            {
                return NotFound("Pes s tímto ID neexistuje.");
            }

            existingDog.Name = updatedDog.Name;
            existingDog.Gender = updatedDog.Gender;
            existingDog.Description = updatedDog.Description;
            existingDog.IsReserved = updatedDog.IsReserved;

            // ZMĚNA: Odstraněno existingDog.ImageUrl = updatedDog.ImageUrl;
            // Místo toho smažeme staré fotky z databáze a nahradíme je novými z požadavku
            _context.DogImages.RemoveRange(existingDog.Images);
            existingDog.Images = updatedDog.Images;

            await _context.SaveChangesAsync();

            return Ok(existingDog);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDog(int id)
        {
            var dog = await _context.Dogs.FindAsync(id);
            if (dog == null)
            {
                return NotFound("Pes s tímto ID neexistuje.");
            }

            _context.Dogs.Remove(dog);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}