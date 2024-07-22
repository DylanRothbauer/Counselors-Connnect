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

            // Seed data for Counselors
            modelBuilder.Entity<Counselor>().ToTable("Counselors")
                .HasData(
                    new Counselor { CounselorID = 1, Name = "John Doe", Username = "johndoe", Password = "password" },
                    new Counselor { CounselorID = 2, Name = "Brody Van Eperen", Username = "bvaneperen", Password = "BrodyV1" }
                );

            // Seed data for Students
            modelBuilder.Entity<Student>().ToTable("Students")
                .HasData(
                    new Student { StudentID = 1, FirstName = "Alice", LastName = "Smith", Grade = 10, AdvisorName = "Mr. Brown" },
                    new Student { StudentID = 2, FirstName = "Bob", LastName = "Johnson", Grade = 11, AdvisorName = "Mrs. Green" },
                    new Student { StudentID = 3, FirstName = "Charlie", LastName = "Brown", Grade = 12, AdvisorName = "Mr. White" }
                );

            // Seed data for Topics
            modelBuilder.Entity<Topic>().ToTable("Topics")
                .HasData(
                    new Topic { TopicID = 1, TopicName = "Academic" },
                    new Topic { TopicID = 2, TopicName = "Career" },
                    new Topic { TopicID = 3, TopicName = "Personal" }
                );

            // Seed data for Visits
            modelBuilder.Entity<Visit>().ToTable("Visits")
                .HasData(
                    new Visit
                    {
                        VisitID = 1,
                        StudentID = 1,
                        CounselorID = 1,
                        Date = new DateTime(2024, 7, 19),
                        Description = "Initial counseling session",
                        File = false,
                        FilePath = "http://example.com/files/1",
                        ParentsCalled = true,
                        Length = 30
                    },
                    new Visit
                    {
                        VisitID = 2,
                        StudentID = 2,
                        CounselorID = 1,
                        Date = new DateTime(2024, 7, 20),
                        Description = "Follow-up session",
                        File = true,
                        FilePath = "http://example.com/files/2",
                        ParentsCalled = false,
                        Length = 45
                    },
                    new Visit
                    {
                        VisitID = 3,
                        StudentID = 3,
                        CounselorID = 2,
                        Date = new DateTime(2024, 7, 21),
                        Description = "Career guidance",
                        File = true,
                        FilePath = "http://example.com/files/3",
                        ParentsCalled = true,
                        Length = 60
                    }
                );

            // Seed data for VisitTopics
            modelBuilder.Entity<VisitTopic>().ToTable("VisitTopics")
                .HasData(
                    new VisitTopic { VisitID = 1, TopicID = 1 },
                    new VisitTopic { VisitID = 1, TopicID = 2 },
                    new VisitTopic { VisitID = 2, TopicID = 3 },
                    new VisitTopic { VisitID = 3, TopicID = 1 },
                    new VisitTopic { VisitID = 3, TopicID = 3 }
                );
        }
    }
}
