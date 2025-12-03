using System.Security.Claims;

namespace Template.Core.Security;

public class CookieResult
{
    public required string AuthenticationScheme { get; set; }

    public required ClaimsPrincipal Claims{ get; set; }

    public DateTime ExpiresAt { get; set; }

    public Dictionary<string, string?>? AuthenticationProperties { get; set; }
}
