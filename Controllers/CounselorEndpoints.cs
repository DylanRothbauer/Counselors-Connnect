using Microsoft.EntityFrameworkCore;
using Counselors_Connect.Data;
using Counselors_Connect.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.OpenApi;
namespace Counselors_Connect.Controllers;

public static class CounselorEndpoints
{
    public static void MapCounselorEndpoints (this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Counselor").WithTags(nameof(Counselor));

        group.MapGet("/", async (AppDbContext db) =>
        {
            return await db.Counselors.ToListAsync();
        })
        .WithName("GetAllCounselors")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<Counselor>, NotFound>> (int counselorid, AppDbContext db) =>
        {
            return await db.Counselors.AsNoTracking()
                .FirstOrDefaultAsync(model => model.CounselorID == counselorid)
                is Counselor model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetCounselorById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (int counselorid, Counselor counselor, AppDbContext db) =>
        {
            var affected = await db.Counselors
                .Where(model => model.CounselorID == counselorid)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.CounselorID, counselor.CounselorID)
                    .SetProperty(m => m.Name, counselor.Name)
                    .SetProperty(m => m.Username, counselor.Username)
                    .SetProperty(m => m.Password, counselor.Password)
                    );
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateCounselor")
        .WithOpenApi();

        group.MapPost("/", async (Counselor counselor, AppDbContext db) =>
        {
            db.Counselors.Add(counselor);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Counselor/{counselor.CounselorID}",counselor);
        })
        .WithName("CreateCounselor")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (int counselorid, AppDbContext db) =>
        {
            var affected = await db.Counselors
                .Where(model => model.CounselorID == counselorid)
                .ExecuteDeleteAsync();
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteCounselor")
        .WithOpenApi();
    }
}
