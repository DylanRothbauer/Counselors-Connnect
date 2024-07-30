using Counselors_Connect.Models;
using Microsoft.EntityFrameworkCore;

namespace Counselors_Connect.Data
{
    public class DataSeeder
    {
        public static void SeedDevelopment(AppDbContext context)
        {
            // Seed data for Counselors
            if (!context.Counselors.Any())
            {
                context.Counselors.AddRange(
                    new Counselor { CounselorID=1,Name = "John Doe", Username = "johndoe", Password = "password" },
                    new Counselor { CounselorID=2, Name = "Brody Van Eperen", Username = "bvaneperen", Password = "BrodyV1" }
                );
                context.SaveChanges();
            }
            

            // Seed data for Students
            if (!context.Students.Any())
            {
                context.Students.AddRange(
                    new Student {StudentID=8995750, FirstName = "Alice", LastName = "Smith", Grade = 10, AdvisorName = "Mr. Brown" },
                    new Student { StudentID = 8995751, FirstName = "Bob", LastName = "Johnson", Grade = 11, AdvisorName = "Mrs. Green" },
                    new Student { StudentID = 8995752, FirstName = "Charlie", LastName = "Brown", Grade = 12, AdvisorName = "Mr. White" }
                );
                context.SaveChanges();
            }

            // Seed data for Topics
            if (!context.Topics.Any())
            {
                context.Topics.AddRange(
                    new Topic { TopicName = "Academic" },
                    new Topic { TopicName = "Career" },
                    new Topic { TopicName = "Personal" }
                );
                context.SaveChanges();
            }

            // Seed data for Visits
            if (!context.Visits.Any())
            {
                context.Visits.AddRange(
                    new Visit
                    {
                        StudentID = 8995750,
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
                        StudentID = 8995751,
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
                        StudentID = 8995752,
                        CounselorID = 2,
                        Date = new DateTime(2024, 7, 21),
                        Description = "Career guidance",
                        File = true,
                        FilePath = "http://example.com/files/3",
                        ParentsCalled = true,
                        Length = 60
                    }
                );
                context.SaveChanges();
            }
            // Seed data for VisitTopics
            if (!context.VisitTopics.Any() && context.Visits.Any() )
            {
                var visit1 = context.Visits.First(v => v.Description == "Initial counseling session");
                var visit2 = context.Visits.First(v => v.Description == "Follow-up session");
                var visit3 = context.Visits.First(v => v.Description == "Career guidance");

                var topic1 = context.Topics.First(t => t.TopicName == "Academic");
                var topic2 = context.Topics.First(t => t.TopicName == "Career");
                var topic3 = context.Topics.First(t => t.TopicName == "Personal");

                context.VisitTopics.AddRange(
                    new VisitTopic { VisitID = visit1.VisitID, TopicID = topic1.TopicID },
                    new VisitTopic { VisitID = visit1.VisitID, TopicID = topic2.TopicID },
                    new VisitTopic { VisitID = visit2.VisitID, TopicID = topic3.TopicID },
                    new VisitTopic { VisitID = visit3.VisitID, TopicID = topic1.TopicID },
                    new VisitTopic { VisitID = visit3.VisitID, TopicID = topic3.TopicID }
                );
                context.SaveChanges();
            }
        }
    

        public static void SeedProduction(AppDbContext context)
        {
            if (!context.Counselors.Any())
            {
                context.Counselors.AddRange(
                  new Counselor { CounselorID = 1, Name = "Justin Allard", Username = "jallard", Password = "admin" },
                  new Counselor { CounselorID = 2, Name = "Neela McCutchin", Username = "nmccutchin", Password = "admin" }
              );
                context.SaveChanges();
            }


        }
    }
}
