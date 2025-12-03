using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Template.Api.Handlers;
using Template.Application.Interfaces.Security;
using Template.Contract.Authentication;

namespace Template.Api.Extensions.EndpointMappers;

public static class AuthenticationMapper
{
    public static WebApplication MapAuthenticationEndpoint(this WebApplication app)
    {
        app.MapPost("/auth/token", ([FromBody] UserCredentialsRequest credentials, Application.Interfaces.Security.IAuthenticationService authService, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var result = await authService.GetTokenAsync(credentials, ct);

                if (!result.IsAuthenticated)
                {
                    return Results.Unauthorized();
                }

                return Results.Ok(result);
            }))
        .AllowAnonymous()
        .WithName("GetToken")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/token/refresh", ([FromBody] RefreshTokenRequest request, Application.Interfaces.Security.IAuthenticationService authService, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var result = await authService.RefreshTokenAsync(request, ct);

            if (!result.IsAuthenticated)
            {
                return Results.Unauthorized();
            }

            return Results.Ok(new
            {
                token = result.Token,
                refreshToken = result.RefreshToken,
                expiresAt = result.ExpiresAt
            });
        }))
        .AllowAnonymous()
        .WithName("RefreshToken")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/token/revoke", (Application.Interfaces.Security.IAuthenticationService authService, HttpContext httpContext, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            await authService.RevokeTokenAsync(httpContext.User, ct);

            return Results.NoContent();
        }))
        .RequireAuthorization()
        .WithName("RevokeToken")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/register", ([FromBody] UserRegistrationRequest request, IUserRegistrationService registrationService, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var result = await registrationService.RegisterUserAsync(request, ct);

                return result.Status switch
                {
                    UserRegistrationStatus.Success => Results.Created($"/users/{result.UserId}", new
                    {
                        userId = result.UserId,
                        message = result.Message
                    }),
                    UserRegistrationStatus.UserAlreadyRegistered => Results.Conflict(new
                    {
                        error = result.Message,
                        status = result.Status.ToString()
                    }),
                    UserRegistrationStatus.PartialMatchRequiresReset => Results.Conflict(new
                    {
                        error = result.Message,
                        status = result.Status.ToString()
                    }),
                    _ => Results.Problem(result.Message, statusCode: StatusCodes.Status500InternalServerError)
                };
            }))
        .AllowAnonymous()
        .WithName("RegisterUser")
        .Produces(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status409Conflict)
        .Produces(StatusCodes.Status500InternalServerError)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/cookie", ([FromBody] UserCredentialsRequest credentials, Application.Interfaces.Security.IAuthenticationService authService, HttpContext httpContext, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var result = await authService.SignInCookieAsync(credentials, httpContext, ct);

                if (!result.IsAuthenticated)
                {
                    return Results.Json(new { error = result.ErrorMessage }, statusCode: StatusCodes.Status401Unauthorized);
                }

                return Results.Ok(new
                {
                    userId = result.UserId,
                    isAuthenticated = true,
                    expiresAt = result.ExpiresAt
                });
            }))
        .AllowAnonymous()
        .WithName("SignInCookie")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/cookie/logout", (Application.Interfaces.Security.IAuthenticationService authService, HttpContext httpContext, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            await authService.SignOutCookieAsync(httpContext, ct);

            return Results.NoContent();
        }))
        .RequireAuthorization()
        .WithName("SignOutCookie")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");

        return app;
    }
}
