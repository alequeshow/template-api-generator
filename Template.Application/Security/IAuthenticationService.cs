using Template.Contract.Authentication;

namespace Template.Application.Security;

/// <summary>
/// Service for handling user authentication and token generation.
/// </summary>
public interface IAuthenticationService
{
    /// <summary>
    /// Authenticates a user with their credentials.
    /// </summary>
    Task<AuthenticationResult> AuthenticateAsync(UserCredentialsRequest credentials, CancellationToken cancellationToken = default);

    /// <summary>
    /// Refreshes an authentication token.
    /// </summary>
    Task<AuthenticationResult> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates a token and returns the user ID if valid.
    /// </summary>
    Task<string?> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);

    /// <summary>
    /// Revokes a refresh token.
    /// </summary>
    Task RevokeTokenAsync(string userId, CancellationToken cancellationToken = default);
}
