using System.Globalization;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Template.Core.Interfaces.Security;
using Template.Infrastructure.Configuration;

namespace Template.Core.Security;

public class CookieService(IOptions<CookieSettings> cookieSettings) : ICookieService
{
    private const string IssuedUtcKey = ".issued";
    private const string ExpiresUtcKey = ".expires";
    private const string IsPersistentKey = ".persistent";
    private const string RefreshKey = ".refresh";
    private const string UtcDateTimeFormat = "r";

    private readonly CookieSettings _cookieSettings = cookieSettings.Value;

    public CookieResult GenerateAuthCookie(string userId, string email, IEnumerable<Claim>? additionalClaims = null)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Email, email),
        };

        if (additionalClaims is not null)
        {
            claims.AddRange(additionalClaims);
        }

        var claimsIdentity = new ClaimsIdentity(claims, CookieSettings.CookieAuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
        var expiresAt = DateTime.UtcNow.AddMinutes(_cookieSettings.ExpirationMinutes);

        var authenticationProperties = new Dictionary<string, string?>
        {
            { IssuedUtcKey, DateTime.UtcNow.ToString(UtcDateTimeFormat, CultureInfo.InvariantCulture) },
            { ExpiresUtcKey, expiresAt.ToString(UtcDateTimeFormat, CultureInfo.InvariantCulture) },
            { IsPersistentKey, "true" },
            { RefreshKey, "true" }
        };

        return new CookieResult
        {
            AuthenticationScheme = CookieSettings.CookieAuthenticationScheme,
            Claims = claimsPrincipal,
            ExpiresAt = expiresAt,
            AuthenticationProperties = authenticationProperties
        };            
    }
}
