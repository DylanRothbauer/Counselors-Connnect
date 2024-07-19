using Counselors_Connect.Data;
using Counselors_Connect.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                return Ok(new {Message = "Login successful"});
            }
            else
            {
                return Unauthorized(new {Message = "Invalid username or password"});
            }
        }
    }
}
