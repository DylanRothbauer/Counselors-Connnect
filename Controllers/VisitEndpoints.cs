using Microsoft.EntityFrameworkCore;
using Counselors_Connect.Data;
using Counselors_Connect.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.OpenApi;
namespace Counselors_Connect.Controllers;

public static class VisitEndpoints
{
    public static void MapVisitEndpoints (this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Visit").WithTags(nameof(Visit));

        group.MapGet("/", async (AppDbContext db) =>
        {
            return await db.Visits.ToListAsync();
        })
        .WithName("GetAllVisits")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<Visit>, NotFound>> (int visitid, AppDbContext db) =>
        {
            return await db.Visits.AsNoTracking()
                .FirstOrDefaultAsync(model => model.VisitID == visitid)
                is Visit model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetVisitById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (int visitid, Visit visit, AppDbContext db) =>
        {
            var affected = await db.Visits
                .Where(model => model.VisitID == visitid)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.VisitID, visit.VisitID)
                    .SetProperty(m => m.StudentID, visit.StudentID)
                    .SetProperty(m => m.CounselorID, visit.CounselorID)
                    .SetProperty(m => m.Date, visit.Date)
                    .SetProperty(m => m.Description, visit.Description)
                    .SetProperty(m => m.File, visit.File)
                    .SetProperty(m => m.FilePath, visit.FilePath)
                    .SetProperty(m => m.ParentsCalled, visit.ParentsCalled)
                    .SetProperty(m => m.Length, visit.Length)
                    );
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateVisit")
        .WithOpenApi();

        group.MapPost("/", async (Visit visit, AppDbContext db) =>
        {
            db.Visits.Add(visit);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Visit/{visit.VisitID}",visit);
        })
        .WithName("CreateVisit")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (int visitid, AppDbContext db) =>
        {
            var visitTopics = await db.VisitTopics
                .Where(model => model.VisitID == visitid)
                .ExecuteDeleteAsync();
             
            
                var affected = await db.Visits
                    .Where(model => model.VisitID == visitid)
                    .ExecuteDeleteAsync();
                return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
           
        })
        .WithName("DeleteVisit")
        .WithOpenApi();
    }
}
