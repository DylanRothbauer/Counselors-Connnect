using Microsoft.AspNetCore.Mvc;

namespace Counselors_Connect.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
    }
}
