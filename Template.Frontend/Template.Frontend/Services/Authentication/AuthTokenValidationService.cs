using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Template.Contract.Authentication;
using Template.Frontend.Services.Interfaces.ApiClients;

namespace Template.Frontend.Services.Authentication;

public class AuthTokenValidationService(
    IAuthenticationApiClient authenticationApiClient,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ILogger<AuthTokenValidationService> logger)
{
    public async Task<bool> ValidateAndRefreshTokenAsync(ClaimsPrincipal? principal)
    {
        if (principal is null)
            return false;

        if (principal.Identity?.IsAuthenticated == false)
        {
            await signInManager.SignOutAsync();
            return false;
        }

        var tokenExpirationDate = principal.GetTokenExpiresAt();
        var token = principal.GetAuthToken();

        if (tokenExpirationDate is null || token is null)
        {
            // TODO: Check if this method conflicts with CookieValidatePrincipalContext.RejectPrincipal
            await signInManager.SignOutAsync();
            return false;
        }

        if (tokenExpirationDate <= DateTime.UtcNow)
        {
            // Token expired                
            logger.LogDebug("Token expired at {ExpirationTime}, signing out user", tokenExpirationDate);

            await signInManager.SignOutAsync();
            return false;
        }

        // Refresh token if close to expiration
        var refreshToken = principal.GetRefreshAuthToken();
        if (tokenExpirationDate <= DateTime.UtcNow.AddMinutes(30) && !string.IsNullOrEmpty(refreshToken))
        {
            logger.LogInformation("Refreshing token with at {ExpirationTime}", tokenExpirationDate);

            try
            {
                var refreshResult = await authenticationApiClient.RefreshTokenAsync(new RefreshTokenRequest
                {
                    Token = token,
                    RefreshToken = refreshToken
                });

                if (refreshResult.Token is null)
                {
                    await signInManager.SignOutAsync();
                    return false;
                }

                // Along with Token, update all user information from backend for consistency
                var user = await authenticationApiClient.GetUserInfoWithTokenAsync(refreshResult.Token);

                var applicationUser = user!.MapFromUserContract();

                applicationUser.AuthToken = refreshResult.Token;
                applicationUser.RefreshAuthToken = refreshResult.RefreshToken;
                applicationUser.TokenExpiresAt = refreshResult.ExpiresAt;

                await userManager.UpdateAsync(applicationUser);
                await signInManager.RefreshSignInAsync(applicationUser);

                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error refreshing authentication token");
                await signInManager.SignOutAsync();
                return false;
            }
        }

        return true;
    }
}
