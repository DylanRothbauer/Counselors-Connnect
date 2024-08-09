using Microsoft.EntityFrameworkCore;
using Counselors_Connect.Data;
using Counselors_Connect.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.OpenApi;
namespace Counselors_Connect.Controllers;

public static class TopicEndpoints
{
    public static void MapTopicEndpoints (this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Topic").WithTags(nameof(Topic));

        group.MapGet("/", async (AppDbContext db) =>
        {
            return await db.Topics.ToListAsync();
        })
        .WithName("GetAllTopics")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<Topic>, NotFound>> (int topicid, AppDbContext db) =>
        {
            return await db.Topics.AsNoTracking()
                .FirstOrDefaultAsync(model => model.TopicID == topicid)
                is Topic model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetTopicById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (int topicid, Topic topic, AppDbContext db) =>
        {
            var affected = await db.Topics
                .Where(model => model.TopicID == topicid)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.TopicName, topic.TopicName)
                    );
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateTopic")
        .WithOpenApi();

        group.MapPost("/", async (Topic topic, AppDbContext db) =>
        {
            db.Topics.Add(topic);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Topic/{topic.TopicID}",topic);
        })
        .WithName("CreateTopic")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (int topicid, AppDbContext db) =>
        {
            var visitTopics = await db.VisitTopics
                .Where(model => model.TopicID == topicid)
                .ExecuteDeleteAsync();

            var affected = await db.Topics
                .Where(model => model.TopicID == topicid)
                .ExecuteDeleteAsync();
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteTopic")
        .WithOpenApi();
    }
}
