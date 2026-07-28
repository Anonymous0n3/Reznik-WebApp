using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reznik_WebApp.Server.Models;

namespace Reznik_WebApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetReservations()
        {
            var reservations = await _context.Reservations.ToListAsync();
            return Ok(reservations);
        }

        [AllowAnonymous]
        [HttpGet("bylitter/{litterId}")]
        public async Task<IActionResult> GetReservationsByLitter(int litterId)
        {
            var reservations = await _context.Reservations
                .Where(r => r.LitterId == litterId)
                .ToListAsync();
            return Ok(reservations);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReservation([FromBody] Reservation reservation)
        {
            reservation.Litter = null;
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();
            return Ok(reservation);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] Reservation updatedReservation)
        {
            if (id != updatedReservation.Id) return BadRequest();

            var existing = await _context.Reservations.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = updatedReservation.Name;
            existing.PreferredGender = updatedReservation.PreferredGender;
            existing.LitterId = updatedReservation.LitterId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null) return NotFound();

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}