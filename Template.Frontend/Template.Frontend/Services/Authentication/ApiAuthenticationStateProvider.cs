using Microsoft.AspNetCore.Components.Authorization;
using System.Security.Claims;
using Template.Contract.Authentication;

namespace Template.Frontend.Services.Authentication;

public class ApiAuthenticationStateProvider : AuthenticationStateProvider
{
    private readonly ILogger<ApiAuthenticationStateProvider> _logger;
    private ClaimsPrincipal _currentUser = new(new ClaimsIdentity());

    public ApiAuthenticationStateProvider(ILogger<ApiAuthenticationStateProvider> logger)
    {
        _logger = logger;
    }

    public override Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        return Task.FromResult(new AuthenticationState(_currentUser));
    }

    /// <summary>
    /// Sets the authentication state from the sign-in response claims
    /// </summary>
    public void SetAuthenticationState(CookieAuthenticationResult authResult)
    {
        if (authResult?.UserId is null || authResult?.Identity is null)
        {
            _logger.LogWarning("Attempted to set authentication state with null or invalid auth result");
            MarkUserAsLoggedOut();
            return;
        }

        try
        {
            _currentUser = new ClaimsPrincipal(authResult.Identity);

            _logger.LogInformation("User {UserId} authentication state set successfully", authResult.UserId);

            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_currentUser)));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting authentication state for user {UserId}", authResult.UserId);
            MarkUserAsLoggedOut();
        }
    }

    /// <summary>
    /// Marks the user as logged out and notifies subscribers
    /// </summary>
    public void MarkUserAsLoggedOut()
    {
        _currentUser = new ClaimsPrincipal(new ClaimsIdentity());

        _logger.LogInformation("User marked as logged out");

        // Notify all subscribers that user is now anonymous
        NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_currentUser)));
    }

    /// <summary>
    /// Gets the current user's ID if authenticated
    /// </summary>
    public string? GetCurrentUserId()
    {
        return _currentUser?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    /// <summary>
    /// Checks if the current user is authenticated
    /// </summary>
    public bool IsAuthenticated()
    {
        return _currentUser?.Identity?.IsAuthenticated ?? false;
    }
}