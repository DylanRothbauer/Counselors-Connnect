using Microsoft.EntityFrameworkCore;

namespace Counselors_Connect.Data
{
    public class ExDbContext : DbContext
    {
        public DbSet<Counselors_Connect.Models.ExampleStudent> ExampleStudents { get; set; } = default!; 

        public ExDbContext(DbContextOptions<ExDbContext> options) : base(options)
        {
        }

    }
}
