using Microsoft.AspNetCore.Mvc;

namespace Counselors_Connect.Controllers
{
    public class DemoPageController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
