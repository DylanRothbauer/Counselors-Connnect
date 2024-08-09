using Microsoft.AspNetCore.Mvc;

namespace Counselors_Connect.Controllers
{
    public class TopicViewController : Controller
    {
        public IActionResult TopicView()
        {
            return View();
        }
    }
}
