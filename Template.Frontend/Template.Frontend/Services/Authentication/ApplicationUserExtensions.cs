using System.Security.Claims;
using Template.Contract;

namespace Template.Frontend.Services.Authentication;

public static class ApplicationUserExtensions
{
    public static ApplicationUser MapFromUserContract(this User user)
    {
        return new ApplicationUser
        {
            Id = user.Id!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserId,
            Email = user.Email,
            NormalizedEmail = user.Email.ToLowerInvariant(),
            NormalizedUserName = user.UserId.ToLowerInvariant(),
            EmailConfirmed = user.IsActive           
        };
    }

    public static User MapToUserContract(this ApplicationUser user)
    {
        return new User
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserId = user.UserName!,
            Email = user.Email!,
            IsActive = user.EmailConfirmed
        };
    }

    public static string? GetAuthToken(this ClaimsPrincipal user)
    {
        return user?.FindFirst("AuthToken")?.Value;
    }

    public static string? GetRefreshAuthToken(this ClaimsPrincipal user)
    {
        return user?.FindFirst("RefreshAuthToken")?.Value;
    }

    public static DateTime? GetTokenExpiresAt(this ClaimsPrincipal user)
    {
        var expirationTicks = user?.FindFirst("TokenExpiresAt")?.Value;

        if (long.TryParse(expirationTicks, out var ticks))
        {
            return new DateTime(ticks, DateTimeKind.Utc);
        }

        return null;
    }
}