using Microsoft.AspNetCore.Identity;
using Template.Frontend.Services.Interfaces;

namespace Template.Frontend.Services.Authentication;

public class ApiUserStore : IUserStore<ApplicationUser>, IUserEmailStore<ApplicationUser>, IUserPasswordStore<ApplicationUser>
{
    private readonly IAuthenticationApiClient _apiClient;

    public ApiUserStore(IAuthenticationApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    public Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        // TODO: Review this assumption: Registration is handled separately via RegisterAsync
        // Why return success here once it does nothing?
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        throw new NotImplementedException("Delete not supported");
    }

    public async Task<ApplicationUser?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
    {
        var user = await _apiClient.GetUserInfoAsync();

        if (user is null || (user?.Email.Equals(normalizedEmail, StringComparison.InvariantCultureIgnoreCase) ?? false))
        {
            return null;
        }

        return new ApplicationUser
        {
            Id = user!.Id!,
            UserName = user.UserId,
            Email = user.Email,
            NormalizedEmail = user.Email.ToLowerInvariant(),
            NormalizedUserName = user.UserId.ToLowerInvariant(),
            EmailConfirmed = true
        };
    }

    public async Task<ApplicationUser?> FindByIdAsync(string userId, CancellationToken cancellationToken)
    {
        var user = await _apiClient.GetUserInfoAsync();

        if (user is null || (!user?.Id?.Equals(userId, StringComparison.InvariantCultureIgnoreCase) ?? false))
        {
            return null;
        }

        return new ApplicationUser
        {
            Id = user!.Id!,
            UserName = user.UserId,
            Email = user.Email,
            NormalizedEmail = user.Email.ToUpperInvariant(),
            NormalizedUserName = user.UserId.ToUpperInvariant(),
            EmailConfirmed = true
        };
    }

    public async Task<ApplicationUser?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
    {
        var user = await _apiClient.GetUserInfoAsync();

        if (user is null || (!user?.UserId.Equals(normalizedUserName, StringComparison.InvariantCultureIgnoreCase) ?? false))
        {
            return null;
        }

        return new ApplicationUser
        {
            Id = user!.Id!,
            UserName = user.UserId,
            Email = user.Email,
            NormalizedEmail = user.Email.ToUpperInvariant(),
            NormalizedUserName = user.UserId.ToUpperInvariant(),
            EmailConfirmed = true
        };
    }

    public Task<string?> GetEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.Email);
    }

    public Task<bool> GetEmailConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(true); // API handles confirmation
    }

    public Task<string?> GetNormalizedEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.NormalizedEmail);
    }

    public Task<string?> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.NormalizedUserName);
    }

    public Task<string?> GetPasswordHashAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        // Password is managed by API
        throw new NotImplementedException("Method not allowed");
    }

    public Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.Id);
    }

    public Task<string?> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.UserName);
    }

    public Task<bool> HasPasswordAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(true);
    }

    public Task SetEmailAsync(ApplicationUser user, string? email, CancellationToken cancellationToken)
    {
        // Email is managed by API
        throw new NotImplementedException("Method not allowed");
    }

    public Task SetEmailConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task SetNormalizedEmailAsync(ApplicationUser user, string? normalizedEmail, CancellationToken cancellationToken)
    {
        // Email is managed by API
        throw new NotImplementedException("Method not allowed");
    }

    public Task SetNormalizedUserNameAsync(ApplicationUser user, string? normalizedName, CancellationToken cancellationToken)
    {
        // User is managed by API
        throw new NotImplementedException("Method not allowed");
    }

    public Task SetPasswordHashAsync(ApplicationUser user, string? passwordHash, CancellationToken cancellationToken)
    {
        // Password is managed by API
        throw new NotImplementedException("Method not allowed");
    }

    public Task SetUserNameAsync(ApplicationUser user, string? userName, CancellationToken cancellationToken)
    {
        // User is managed by API
        throw new NotImplementedException("Method not allowed");
    }

    public Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        // User is managed by API
        throw new NotImplementedException("Method not allowed");
    }

    public void Dispose()
    {
        GC.SuppressFinalize(this);
    }
}