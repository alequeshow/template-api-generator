using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Template.Frontend.Services.Authentication;

public class ApplicationUserClaimsPrincipalFactory(
    UserManager<ApplicationUser> userManager,
    IOptions<IdentityOptions> optionsAccessor) : UserClaimsPrincipalFactory<ApplicationUser>(userManager, optionsAccessor)
{
    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);

        if (!string.IsNullOrEmpty(user.FirstName))
        {
            identity.AddClaim(new Claim("FirstName", user.FirstName));
        }

        if (!string.IsNullOrEmpty(user.LastName))
        {
            identity.AddClaim(new Claim("LastName", user.LastName));
        }

        // Add JWT token as a claim
        if (!string.IsNullOrEmpty(user.AuthToken))
        {
            identity.AddClaim(new Claim("AuthToken", user.AuthToken));
        }

        if (!string.IsNullOrEmpty(user.RefreshAuthToken))
        {
            identity.AddClaim(new Claim("RefreshAuthToken", user.RefreshAuthToken));
        }

        if (user.TokenExpiresAt.HasValue)
        {
            identity.AddClaim(new Claim("TokenExpiresAt", user.TokenExpiresAt.Value.Ticks.ToString()));
        }

        return identity;
    }
}