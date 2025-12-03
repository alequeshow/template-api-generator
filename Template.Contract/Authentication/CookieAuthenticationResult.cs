using System.Security.Claims;

namespace Template.Contract.Authentication;

public class CookieAuthenticationResult : BaseAuthenticationResult
{
    public string? AuthenticationScheme { get; set; }

    public ClaimsPrincipal? Claims { get; set; }

    public Dictionary<string, string?>? AuthenticationProperties { get; set; }
}
