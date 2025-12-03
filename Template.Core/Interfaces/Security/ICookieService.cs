using System.Security.Claims;
using Template.Core.Security;

namespace Template.Core.Interfaces.Security;

/// <summary>
/// Service for generating and validating JWT tokens.
/// </summary>
public interface ICookieService
{
    /// <summary>
    /// Generates an authentication cookie for a user.
    /// </summary>
    CookieResult GenerateAuthCookie(string userId, string email, IEnumerable<Claim>? additionalClaims = null);
}
