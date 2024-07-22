using Counselors_Connect.Data;
using Counselors_Connect.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Counselors_Connect.Controllers
{
    public class MultipleModelsController : Controller
    {
        private readonly AppDbContext _context;

        public MultipleModelsController(AppDbContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var visits = _context.Visits.ToList();
            var students = _context.Students.ToList();

            var viewModel = new MultipleModels()
            {
                Visits = visits,
                Students = students
            };

            return View(viewModel);
        }

    }
}
