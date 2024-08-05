using Microsoft.EntityFrameworkCore;
using Counselors_Connect.Data;
using Counselors_Connect.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections.Generic;
namespace Counselors_Connect.Controllers;

public static class StudentEndpoints
{
    public static void MapStudentEndpoints (this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Student").WithTags(nameof(Student));

        group.MapGet("/", async (AppDbContext db) =>
        {
            return await db.Students.ToListAsync();
        })
        .WithName("GetAllStudents")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<Student>, NotFound>> (int studentid, AppDbContext db) =>
        {
            return await db.Students.AsNoTracking()
                .FirstOrDefaultAsync(model => model.StudentID == studentid)
                is Student model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetStudentById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (int studentid, Student student, AppDbContext db) =>
        {
            var affected = await db.Students
                .Where(model => model.StudentID == studentid)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.StudentID, student.StudentID)
                    .SetProperty(m => m.FirstName, student.FirstName)
                    .SetProperty(m => m.LastName, student.LastName)
                    .SetProperty(m => m.Grade, student.Grade)
                    .SetProperty(m => m.AdvisorName, student.AdvisorName)
                    );
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateStudent")
        .WithOpenApi();

        group.MapPost("/", async (Student student, AppDbContext db) =>
        {
            try
            {
                db.Students.Add(student);
                await db.SaveChangesAsync();
                return TypedResults.Created($"/api/Student", student);

            } catch(DbUpdateException ex)
            {
                if (ex.InnerException.Message.Contains("Cannot insert duplicate key"))
                {
                    throw new Exception("Student ID already exists.Please choose a different one.");
                }

                throw new Exception(ex.Message);

            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            
        })
        .WithName("CreateStudent")
        .WithOpenApi();

        group.MapDelete("/Delete", async Task<Results<Ok, NotFound>> (int studentid, AppDbContext db) =>
        {
            var affected = await db.Students
                .Where(model => model.StudentID == studentid)
                .ExecuteDeleteAsync();
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteStudent")
        .WithOpenApi();
    }
}
