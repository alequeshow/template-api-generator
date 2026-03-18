using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Template.Contract.Authentication;
using Template.Frontend.Services.Interfaces.ApiClients;

namespace Template.Frontend.Services.Authentication;

public class ApiUserStore(
    IAuthenticationApiClient apiClient,
    IHttpContextAccessor httpContextAccessor) 
    : IUserStore<ApplicationUser>, IUserEmailStore<ApplicationUser>, IUserPasswordStore<ApplicationUser>
{
    public async Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        var registrationRequest = new UserRegistrationRequest
        {
            UserIdentifier = user.UserName!,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Password = user.PasswordHash!
        };

        await apiClient.RegisterUserAsync(registrationRequest);

        return IdentityResult.Success;
    }

    public Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        throw new NotImplementedException("Delete not supported");
    }

    public Task<ApplicationUser?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
    {
        //TODO: implement endpoint to fetch from by email
        return Task.FromResult<ApplicationUser?>(default);
    }

    public async Task<ApplicationUser?> FindByIdAsync(string userId, CancellationToken cancellationToken)
    {

        // TODO: implement endpoint client to fetch from /users/id
        var user = await apiClient.GetUserInfoAsync();

        if (user is null)
        {
            return null;
        }

        var appUser = user.MapFromUserContract();

        var contextUserId = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        if (appUser.Id.Equals(contextUserId, StringComparison.InvariantCultureIgnoreCase))
        {
            appUser.AuthToken = httpContextAccessor.HttpContext?.User?.GetAuthToken();
            appUser.RefreshAuthToken = httpContextAccessor.HttpContext?.User?.GetRefreshAuthToken();
            appUser.TokenExpiresAt = httpContextAccessor.HttpContext?.User?.GetTokenExpiresAt();
        }

        return appUser;
    }

    public Task<ApplicationUser?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
    {
        //TODO: implement endpoint to fetch from by username
        return Task.FromResult<ApplicationUser?>(default);
    }

    public Task<string?> GetEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.Email);
    }

    public Task<bool> GetEmailConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        // TODO: Implement endpoint to validate user email confirmation
        return Task.FromResult(user.EmailConfirmed);
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
        return Task.FromResult(user.PasswordHash);
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
        return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
    }

    public async Task SetEmailAsync(ApplicationUser user, string? email, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(email);
        
        user.Email = email;
        await SetNormalizedEmailAsync(user, email.ToLowerInvariant(), cancellationToken);
    }

    public Task SetEmailConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
    {
        user.EmailConfirmed = confirmed;

        return Task.CompletedTask;
    }

    public Task SetNormalizedEmailAsync(ApplicationUser user, string? normalizedEmail, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(normalizedEmail);

        user.NormalizedEmail = normalizedEmail.ToLowerInvariant();

        return Task.CompletedTask;
    }

    public Task SetNormalizedUserNameAsync(ApplicationUser user, string? normalizedName, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(normalizedName);

        user.NormalizedUserName = normalizedName.ToLowerInvariant();

        return Task.CompletedTask;
    }

    public Task SetPasswordHashAsync(ApplicationUser user, string? passwordHash, CancellationToken cancellationToken)
    {
        // Used only for create user workflow
        user.PasswordHash = passwordHash;
        return Task.CompletedTask;
    }

    public async Task SetUserNameAsync(ApplicationUser user, string? userName, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(userName);

        user.UserName = userName;
        await SetNormalizedUserNameAsync(user, userName.ToLowerInvariant(), cancellationToken);
    }

    public async Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        var userRequest = user.MapToUserContract();

        await apiClient.UpdateUserAsync(user.Id, userRequest);

        return IdentityResult.Success;
    }

    public void Dispose()
    {
        GC.SuppressFinalize(this);
    }
}