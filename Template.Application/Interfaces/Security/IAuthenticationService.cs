using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Template.Contract.Authentication;

namespace Template.Application.Interfaces.Security;

/// <summary>
/// Service for handling user authentication and token generation.
/// </summary>
public interface IAuthenticationService
{
    /// <summary>
    /// Get authorization token for a user with their credentials.
    /// </summary>
    Task<TokenAuthenticationResult> GetTokenAsync(UserCredentialsRequest credentials, CancellationToken cancellationToken = default);

    /// <summary>
    /// Refreshes an authentication token.
    /// </summary>
    Task<TokenAuthenticationResult> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates a token and returns the user ID if valid.
    /// </summary>
    Task<string?> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);

    /// <summary>
    /// Revokes a refresh token.
    /// </summary>
    Task RevokeTokenAsync(string userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Revokes a refresh token.
    /// </summary>
    Task RevokeTokenAsync(ClaimsPrincipal user, CancellationToken cancellationToken = default);

    /// <summary>
    /// Signs httpContext with the validated user's claims.
    /// </summary>
    Task<CookieAuthenticationResult> SignInCookieAsync(UserCredentialsRequest credentials, HttpContext httpContext, CancellationToken cancellationToken = default);

    /// <summary>
    /// Signs out httpContext from given cookie
    /// </summary>
    Task SignOutCookieAsync(HttpContext httpContext, CancellationToken cancellationToken = default);
}
