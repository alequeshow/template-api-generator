using Microsoft.AspNetCore.Mvc;
using Template.Api.Handlers;
using Template.Application.Interfaces.Security;
using Template.Contract;
using Template.Contract.Authentication;
using Template.Contract.Common;

namespace Template.Api.Extensions.EndpointMappers;

public static class AuthenticationMapper
{
    public static WebApplication MapAuthenticationEndpoint(this WebApplication app)
    {
        app.MapPost("/auth/register", ([FromBody] UserRegistrationRequest request, IUserRegistrationService registrationService, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var result = await registrationService.RegisterUserAsync(request, ct);

                return result.Status switch
                {
                    UserRegistrationStatus.Success => Results.Created($"/users/{result.UserId}", new Result<string>(result.UserId)),
                    UserRegistrationStatus.UserAlreadyRegistered => Results.Conflict(
                        ApiHandler.MapErrorResult(result.Message!, UserRegistrationStatus.UserAlreadyRegistered.ToString())
                    ),
                    UserRegistrationStatus.InvalidData => Results.BadRequest(
                        ApiHandler.MapErrorResult(result.Message!, UserRegistrationStatus.InvalidData.ToString())
                    ),
                    UserRegistrationStatus.PartialMatchRequiresReset => Results.Conflict(
                        ApiHandler.MapErrorResult(result.Message!, UserRegistrationStatus.PartialMatchRequiresReset.ToString())
                    ),
                    _ => throw new Exception(result.Message)
                };
            }))
        .AllowAnonymous()
        .WithName("RegisterUser")
        .Produces<Result<string>>(StatusCodes.Status201Created)
        .Produces<ErrorResult>(StatusCodes.Status400BadRequest)
        .Produces<ErrorResult>(StatusCodes.Status409Conflict)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/token", ([FromBody] UserCredentialsRequest credentials, IAuthenticationService authService, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var result = await authService.GetTokenAsync(credentials, ct);

                return Results.Ok(result);
            }))
        .AllowAnonymous()
        .WithName("GetToken")
        .ProducesValidationProblem()
        .Produces<TokenAuthenticationResult>(StatusCodes.Status200OK)
        .Produces<ErrorResult>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/token/refresh", ([FromBody] RefreshTokenRequest request, IAuthenticationService authService, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var result = await authService.RefreshTokenAsync(request, ct);

            return Results.Ok(result);
        }))
        .AllowAnonymous()
        .WithName("RefreshToken")
        .Produces<TokenAuthenticationResult>(StatusCodes.Status200OK)
        .Produces<ErrorResult>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/token/revoke", (IAuthenticationService authService, HttpContext httpContext, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            await authService.RevokeTokenAsync(httpContext.User, ct);

            return Results.NoContent();
        }))
        .RequireAuthorization()
        .WithName("RevokeToken")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<ErrorResult>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/userinfo", (IAuthenticationService authService, HttpContext httpContext, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var result = await authService.GetUserInfoAsync(httpContext, ct);

                return Results.Ok(result);
            }))
        .RequireAuthorization()
        .WithName("GetUserInfo")
        .Produces<User>(StatusCodes.Status200OK)
        .Produces<ErrorResult>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");            

        return app;
    }
}
