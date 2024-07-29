using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CsvHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Counselors_Connect.Data;
using Counselors_Connect.Models;

namespace Counselors_Connect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CsvUploadController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly AppDbContext _context;

        public CsvUploadController(IHttpClientFactory httpClientFactory, AppDbContext context)
        {
            _httpClientFactory = httpClientFactory;
            _context = context;
        }

        [HttpPost("uploadCsv")]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty or null.");

            var requiredHeaders = new List<string>
            {
                "StudentID", "CounselorID", "VisitDate", "Description", "File",
                "FilePath", "ParentsCalled", "Length", "FirstName", "LastName", "Grade",
                "AdvisorName", "CounselorName", "CounselorUsername", "CounselorPassword", "Topics"
            };

            using (var reader = new StreamReader(file.OpenReadStream()))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                csv.Read();
                csv.ReadHeader();
                var headers = csv.HeaderRecord;

                if (!requiredHeaders.All(header => headers.Contains(header.Trim())))
                {
                    return BadRequest("Invalid CSV format. Required headers: " + string.Join(", ", requiredHeaders));
                }

                var students = new List<Student>();
                var counselors = new List<Counselor>();
                var visits = new List<Visit>();
                var visitTopics = new List<(Visit Visit, List<int> TopicIDs)>();

                while (csv.Read())
                {
                    var visit = new Visit
                    {
                        StudentID = csv.GetField<int>("StudentID"),
                        CounselorID = csv.GetField<int>("CounselorID"),
                        Date = csv.GetField<DateTime>("VisitDate"),
                        Description = csv.GetField<string>("Description"),
                        File = csv.GetField<bool>("File"),
                        FilePath = csv.GetField<string>("FilePath"),
                        ParentsCalled = csv.GetField<bool>("ParentsCalled"),
                        Length = csv.GetField<int>("Length")
                    };

                    var student = new Student
                    {
                        StudentID = visit.StudentID,
                        FirstName = csv.GetField<string>("FirstName"),
                        LastName = csv.GetField<string>("LastName"),
                        Grade = csv.GetField<int>("Grade"),
                        AdvisorName = csv.GetField<string>("AdvisorName")
                    };

                    var counselor = new Counselor
                    {
                        CounselorID = csv.GetField<int>("CounselorID"),
                        Name = csv.GetField<string>("CounselorName"),
                        Username = csv.GetField<string>("CounselorUsername"),
                        Password = csv.GetField<string>("CounselorPassword")
                    };

                    var topicIDs = csv.GetField<string>("Topics").Split('|').Select(int.Parse).ToList();

                    visits.Add(visit);
                    students.Add(student);
                    counselors.Add(counselor);
                    visitTopics.Add((visit, topicIDs));
                }

                var client = _httpClientFactory.CreateClient("CounselorsClient");

                foreach (var student in students)
                {
                    var response = await client.GetAsync($"/api/Student/GetStudentById?StudentID={student.StudentID}");
                    if (!response.IsSuccessStatusCode) { 
                   
                        response = await client.PostAsJsonAsync("/api/Student", student);
                        if (!response.IsSuccessStatusCode)
                        {
                            return StatusCode((int)response.StatusCode, $"Failed to upload student with ID {student.StudentID}");
                        }
                    }
                }

                foreach (var counselor in counselors)
                {
                    var response = await client.GetAsync($"/api/Counselor/GetCounselorById?CounselorID={counselor.CounselorID}");
                    if (!response.IsSuccessStatusCode)
                    {
                      response = await client.PostAsJsonAsync("/api/Counselor", counselor);
                        if (!response.IsSuccessStatusCode)
                        {
                            return StatusCode((int)response.StatusCode, $"Failed to upload counselor with ID {counselor.CounselorID}");
                        }
                    }
                }

                foreach (var (visit, topicIDs) in visitTopics)
                {
                    var response = await client.PostAsJsonAsync("/api/Visit", visit);
                    if (!response.IsSuccessStatusCode)
                    {
                        return StatusCode((int)response.StatusCode, $"Failed to upload visit for student ID {visit.StudentID}");
                    }

                    var createdVisit = await response.Content.ReadFromJsonAsync<Visit>();

                    foreach (var topicID in topicIDs)
                    {
                        var visitTopic = new VisitTopic
                        {
                            VisitID = createdVisit.VisitID,
                            TopicID = topicID
                        };
                        var visitTopicResponse = await client.PostAsJsonAsync("/api/VisitTopic", visitTopic);
                        if (!visitTopicResponse.IsSuccessStatusCode)
                        {
                            return StatusCode((int)visitTopicResponse.StatusCode, $"Failed to upload visit topic for visit ID {createdVisit.VisitID} and topic ID {topicID}, please ensure your upload does not contain duplicate topics for a visit");
                        }
                    }
                }

                return Ok(new { success = true });
            }
        }
    }
}
