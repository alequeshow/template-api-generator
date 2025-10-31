using Template.Api.Handlers;
using Template.Application.Commands;
using Template.Application.Handlers;
using Template.Application.Queries;
using Template.Contract;
using Template.Contract.Common;

namespace Template.Api.Extensions.EndpointMappers;

public static class UserMapper
{
    public static WebApplication MapUserEndpoint(this WebApplication app)
    {
        app.MapGet("/user/{id}", (string id, UserQueryHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var query = new QuerySingle<User>(id);
            var result = await handler.HandleAsync(query, ct);

            return Results.Ok(result);
        }))
        .RequireAuthorization()
        .WithName("GetUserById")
        .Produces<User>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status404NotFound)
        .WithOpenApi();

        app.MapGet("/user", (UserQueryHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var query = new QueryMany<User>();
            var result = await handler.HandleAsync(query, ct);
            return Results.Ok(result);
        }))
        .RequireAuthorization()
        .WithName("GetUser")
        .Produces<User>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi();

        app.MapPost("/user", (User payload, UserCommandHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var command = new Command<User>(payload, CommandOperation.Create);

            var result = await handler.HandleAsync(command, ct);

            var apiResult = ApiHandler.HandleResult(result);

            return Results.Created($"/user/{apiResult.Id}", apiResult.Id);
        }))
        .WithName("AddUser")
        .Produces<User>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi();

        app.MapPut("/user/{id}", (string id, User payload, UserCommandHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            payload.Id = id;
            var command = new Command<User>(payload, CommandOperation.Update);

            var result = await handler.HandleAsync(command, ct);

            var apiResult = ApiHandler.HandleResult(result);

            return Results.NoContent();
        }))
        .RequireAuthorization()
        .WithName("UpdateUser")
        .Produces<User>(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status404NotFound)
        .WithOpenApi();

        app.MapDelete("/user/{id}", (string id, UserCommandHandler handler, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var command = new Command<User>(new User 
            { 
                Id = id, 
                Email = string.Empty,
                FirstName = string.Empty,
                LastName = string.Empty,
                UserId = string.Empty
            }, CommandOperation.Delete);

            await handler.HandleAsync(command, ct);

            return Results.NoContent();
        }))
        .RequireAuthorization()
        .WithName("DeleteUser")
        .Produces<User>(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status404NotFound)
        .WithOpenApi();

        return app;
    }
}