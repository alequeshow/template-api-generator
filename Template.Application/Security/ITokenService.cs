using System.Security.Claims;

namespace Template.Model.Interfaces.Security;

/// <summary>
/// Service for generating and validating JWT tokens.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Generates an access token for a user.
    /// </summary>
    string GenerateAccessToken(string userId, string email, IEnumerable<Claim>? additionalClaims = null);

    /// <summary>
    /// Generates a refresh token.
    /// </summary>
    string GenerateRefreshToken();

    /// <summary>
    /// Validates a token and returns the principal if valid.
    /// </summary>
    ClaimsPrincipal? ValidateToken(string token);

    /// <summary>
    /// Gets the user ID from a token.
    /// </summary>
    string? GetUserIdFromToken(string token);
}
