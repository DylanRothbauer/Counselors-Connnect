using Microsoft.AspNetCore.Mvc;

namespace Counselors_Connect.Controllers
{
    public class CreateController : Controller
    {
        public IActionResult CreateAVisit()
        {
            return View();
        }

        public IActionResult CreateAStudent()
        {
            return View();
        }
    }
}
