using Microsoft.EntityFrameworkCore;
using Counselors_Connect.Data;
using Counselors_Connect.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.OpenApi;
namespace Counselors_Connect.Controllers;

public static class VisitTopicEndpoints
{
    public static void MapVisitTopicEndpoints (this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/VisitTopic").WithTags(nameof(VisitTopic));

        group.MapGet("/", async (AppDbContext db) =>
        {
            return await db.VisitTopics.ToListAsync();
        })
        .WithName("GetAllVisitTopics")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<VisitTopic>, NotFound>> (int visitid, AppDbContext db) =>
        {
            return await db.VisitTopics.AsNoTracking()
                .FirstOrDefaultAsync(model => model.VisitID == visitid)
                is VisitTopic model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetVisitTopicById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (int visitid, VisitTopic visitTopic, AppDbContext db) =>
        {
            var affected = await db.VisitTopics
                .Where(model => model.VisitID == visitid)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.VisitID, visitTopic.VisitID)
                    .SetProperty(m => m.TopicID, visitTopic.TopicID)
                    );
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateVisitTopic")
        .WithOpenApi();

        group.MapPost("/", async (VisitTopic visitTopic, AppDbContext db) =>
        {
            db.VisitTopics.Add(visitTopic);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/VisitTopic/{visitTopic.VisitID}",visitTopic);
        })
        .WithName("CreateVisitTopic")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (int visitid, AppDbContext db) =>
        {
            var affected = await db.VisitTopics
                .Where(model => model.VisitID == visitid)
                .ExecuteDeleteAsync();
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteVisitTopic")
        .WithOpenApi();
    }
}
