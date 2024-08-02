using System;
using Microsoft.EntityFrameworkCore;
using Counselors_Connect.Models;

namespace Counselors_Connect.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Counselor> Counselors { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<VisitTopic> VisitTopics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the many-to-many relationship between Visit and Topic
            modelBuilder.Entity<VisitTopic>()
                .HasKey(vt => new { vt.VisitID, vt.TopicID });

            modelBuilder.Entity<VisitTopic>()
                .HasOne(vt => vt.Visit)
                .WithMany(v => v.VisitTopics)
                .HasForeignKey(vt => vt.VisitID);

            modelBuilder.Entity<VisitTopic>()
                .HasOne(vt => vt.Topic)
                .WithMany(t => t.VisitTopics)
                .HasForeignKey(vt => vt.TopicID);
        }
    }
}
