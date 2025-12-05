using Template.Api.Handlers;
using Template.Application.Commands;
using Template.Application.Handlers;
using Template.Application.Queries;
using Template.Contract;
using Template.Contract.Common;

namespace Template.Api.Extensions.EndpointMappers;

public static class StatusMapper
{
    public static WebApplication MapStatusEndpoint(this WebApplication app)
    {
        app.MapGet("/status/{id}", (string id, StatusQueryHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var query = new QuerySingle<Status>(id);
            var result = await handler.HandleAsync(query, ct);

            return Results.Ok(result);
        })) 
        .RequireAuthorization()
        .WithName("GetStatusById")
        .Produces<Status>(StatusCodes.Status200OK)
        .Produces<ErrorResult>(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi();

        app.MapGet("/status", (StatusQueryHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var query = new QueryMany<Status>();
            var result = await handler.HandleAsync(query, ct);
            return Results.Ok(result);
        }))
        .RequireAuthorization()
        .WithName("GetStatus")
        .Produces<IEnumerable<Status>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi();

        app.MapPost("/status", (Status payload, StatusCommandHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var command = new Command<Status>(payload, CommandOperation.Create);

            var result = await handler.HandleAsync(command, ct);

            var apiResult = ApiHandler.HandleResult(result);

            return Results.Created($"/status/{apiResult.Id}", apiResult.Id);
        }))
        .RequireAuthorization()
        .WithName("AddStatus")
        .Produces<Status>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi();

        app.MapPut("/status/{id}", (string id, Status payload, StatusCommandHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var command = new Command<Status>(payload, CommandOperation.Update);

            var result = await handler.HandleAsync(command, ct);

            ApiHandler.HandleResult(result);

            return Results.NoContent();
        }))
        .RequireAuthorization()
        .WithName("UpdateStatus")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<ErrorResult>(StatusCodes.Status400BadRequest)
        .Produces<ErrorResult>(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi();

        app.MapDelete("/status/{id}", (string id, StatusCommandHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var command = new Command<Status>(new Status { Id = id, Value = default! }, CommandOperation.Delete);

            var result = await handler.HandleAsync(command, ct);

            ApiHandler.HandleResult(result);

            return Results.NoContent();
        }))
        .RequireAuthorization()
        .WithName("DeleteStatus")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<ErrorResult>(StatusCodes.Status400BadRequest)
        .Produces<ErrorResult>(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi();

        return app;
    }
}