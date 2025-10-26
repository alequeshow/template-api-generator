using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Template.Api.Handlers;
using Template.Application.Security;
using Template.Contract.Authentication;

namespace Template.Api.Extensions.EndpointMappers;

public static class AuthenticationMapper
{
    public static WebApplication MapAuthenticationEndpoint(this WebApplication app)
    {
        app.MapPost("/auth/login", ([FromBody] UserCredentialsRequest credentials, IAuthenticationService authService, CancellationToken ct) =>
            ApiHandler.HandleEndpointAsync(async () =>
            {
                var result = await authService.AuthenticateAsync(credentials, ct);

                if (!result.IsAuthenticated)
                {
                    return Results.Unauthorized();
                }

                return Results.Ok(result);
            }))
        .AllowAnonymous()
        .WithName("Login")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi()
        .WithTags("Authentication");

        app.MapPost("/auth/refresh", ([FromBody] RefreshTokenRequest request, IAuthenticationService authService, CancellationToken ct) =>
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

        app.MapPost("/auth/revoke", (IAuthenticationService authService, HttpContext httpContext, CancellationToken ct) =>
        ApiHandler.HandleEndpointAsync(async () =>
        {
            var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if(string.IsNullOrEmpty(userId))
            {
                userId = httpContext.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            }

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            await authService.RevokeTokenAsync(userId, ct);

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

        return app;
    }
}
