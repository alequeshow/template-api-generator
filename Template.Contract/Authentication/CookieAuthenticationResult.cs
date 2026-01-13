using System.Security.Claims;

namespace Template.Contract.Authentication;

public class CookieAuthenticationResult : BaseAuthenticationResult
{
    public required string AuthenticationScheme { get; set; }

    public required ClaimsIdentity Identity { get; set; }

    public Dictionary<string, string?>? AuthenticationProperties { get; set; }
}
