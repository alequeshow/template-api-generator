using Template.Api.Handlers;
using Template.Application.Commands;
using Template.Application.Handlers;
using Template.Application.Queries;
using Template.Contract;

namespace Template.Api.Extensions.EndpointMappers
{
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
            .WithName("GetStatusById")
            .Produces<Status>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();

            app.MapGet("/status", (StatusQueryHandler handler, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var query = new QueryMany<Status>();
                var result = await handler.HandleAsync(query, ct);
                return Results.Ok(result);
            }))
            .WithName("GetStatus")
            .Produces<Status>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithOpenApi();

            app.MapPost("/status", (Status payload, StatusCommandHandler handler, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var command = new Command<Status>(payload, CommandOperation.Create);

                var result = await handler.HandleAsync(command, ct);

                return Results.Created($"/status/{result.Id}", result.Id);
            }))
            .WithName("AddStatus")
            .Produces<Status>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithOpenApi();

            app.MapPut("/status/{id}", (string id, Status payload, StatusCommandHandler handler, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                payload.Id = id;
                var command = new Command<Status>(payload, CommandOperation.Update);

                await handler.HandleAsync(command, ct);

                return Results.NoContent();
            }))
            .WithName("UpdateStatus")
            .Produces<Status>(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();

            app.MapDelete("/status/{id}", (string id, StatusCommandHandler handler, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var command = new Command<Status>(new Status { Id = id, Value = default! }, CommandOperation.Delete);

                await handler.HandleAsync(command, ct);

                return Results.NoContent();
            }))
            .WithName("DeleteStatus")
            .Produces<Status>(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();

            return app;
        }
    }
}