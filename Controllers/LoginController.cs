using Microsoft.AspNetCore.Mvc;

namespace Counselors_Connect.Controllers
{
    public class LoginController : Controller
    {
        [Route("login")]
        public IActionResult Login()
        {
            return View();
        }


    }
}
