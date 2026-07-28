using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reznik_WebApp.Server.Models;
using System.Security.Claims;

namespace Reznik_WebApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            var user = await _context.AdminUsers.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                return Unauthorized("Nesprávný e-mail nebo heslo.");
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties { IsPersistent = true };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            return Ok(new { message = "Přihlášení proběhlo úspěšně" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [HttpGet("check")]
        public IActionResult CheckAuth()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
                return Ok(new { isAuthenticated = true, user = User.Identity.Name });
            return Unauthorized();
        }

        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetAdmins()
        {
            var admins = await _context.AdminUsers
                .Select(u => new { u.Id, u.Email })
                .ToListAsync();
            return Ok(admins);
        }

        [Authorize]
        [HttpPost("users")]
        public async Task<IActionResult> CreateAdmin([FromBody] LoginRequest model)
        {
            if (await _context.AdminUsers.AnyAsync(u => u.Email == model.Email))
                return BadRequest("Uživatel s tímto e-mailem už existuje.");

            var newAdmin = new AdminUser
            {
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password)
            };

            _context.AdminUsers.Add(newAdmin);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            if (await _context.AdminUsers.CountAsync() <= 1)
                return BadRequest("Nelze smazat posledního administrátora.");

            var admin = await _context.AdminUsers.FindAsync(id);
            if (admin == null) return NotFound();

            _context.AdminUsers.Remove(admin);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}