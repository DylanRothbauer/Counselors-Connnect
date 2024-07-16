using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Counselors_Connect.Models;

namespace Counselors_Connect.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext (DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; } 
        public DbSet<Counselor> Counselors { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<Topic> Topics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>().ToTable("Students");
            modelBuilder.Entity<Counselor>().ToTable("Counselors");
            modelBuilder.Entity<Visit>().ToTable("Visits");
            modelBuilder.Entity<Topic>().ToTable("Topics");
        }
    }
}
