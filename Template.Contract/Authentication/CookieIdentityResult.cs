using System.Security.Claims;

namespace Template.Contract.Authentication;

public class CookieIdentityResult : BaseAuthenticationResult
{
    public required string AuthenticationScheme { get; set; }

    public required ClaimsPrincipal Principal { get; set; }

    public Dictionary<string, string?>? AuthenticationProperties { get; set; }
}
