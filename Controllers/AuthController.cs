using Counselors_Connect.Data;
using Counselors_Connect.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Counselors_Connect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Counselors
                .FirstOrDefaultAsync(u => u.Username == loginDTO.Username);

            if (user != null && user.Password == loginDTO.Password)
            {
                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
        };

                var claimsIdentity = new ClaimsIdentity(
                    claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);


                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    claimsPrincipal,
                    new AuthenticationProperties
                    {
                        IsPersistent = loginDTO.RememberMe, 
                        ExpiresUtc = DateTimeOffset.UtcNow.AddDays(1) 
                    });

                return Ok(new { Message = "Login successful" });
            }
            else
            {
                return Unauthorized(new {Message = "Invalid username or password"});
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        { 
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return RedirectToAction("Index", "Login"); 
        }
    }
}
