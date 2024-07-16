using Microsoft.AspNetCore.Mvc;

namespace Counselors_Connect.Controllers
{
    public class StudentViewController : Controller
    {
        public IActionResult StudentView()
        {
            return View();
        }
    }
}
