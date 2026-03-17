using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Net;
using System.Security.Claims;
using Template.Contract.Authentication;
using Template.Frontend.Services.Interfaces.ApiClients;

namespace Template.Frontend.Services.Authentication;

public class ApiSignInManager(
    UserManager<ApplicationUser> userManager,
    IHttpContextAccessor contextAccessor,
    IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory,
    IOptions<IdentityOptions> optionsAccessor,
    ILogger<SignInManager<ApplicationUser>> logger,
    IAuthenticationSchemeProvider schemes,
    IUserConfirmation<ApplicationUser> confirmation,
    IAuthenticationApiClient apiClient) : SignInManager<ApplicationUser>(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
{
    public override async Task<SignInResult> PasswordSignInAsync(string userName, string password, bool isPersistent, bool lockoutOnFailure)
    {
        var request = new UserCredentialsRequest
        { 
            UserIdentifier = userName,
            Password = password 
        };

        try
        {
            var tokenResult = await apiClient.GetTokenAsync(request);

            if (tokenResult.Token is not null)
            {
                var applicationUser = await GetUserByTokenAsync(tokenResult.Token);

                applicationUser.AuthToken = tokenResult.Token;
                applicationUser.RefreshAuthToken = tokenResult.RefreshToken;
                applicationUser.TokenExpiresAt = tokenResult.ExpiresAt;

                await base.SignInAsync(applicationUser, isPersistent);

                return SignInResult.Success;
            }
        }
        catch (Refit.ApiException ex) 
            when (ex.StatusCode != HttpStatusCode.Unauthorized)
        {
            logger.LogError(ex, "Error during API sign-in for user {UserName}", userName);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during API sign-in for user {UserName}", userName);       
        }

        return SignInResult.Failed;
    }

    public override async Task SignOutAsync()
    {
        try
        {
            //Must call api first to revoke token before signing out because it relies on context user token
            await apiClient.RevokeTokenAsync();            
        }
        catch (Refit.ApiException ex) when (ex.StatusCode == HttpStatusCode.Unauthorized)
        {
            logger.LogInformation(ex, "Token to be revoked already expired. No action needed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during api authorization token revoking");
        }

        await base.SignOutAsync();
        logger.LogInformation("User signed out successfully");
    }

    public override async Task<ApplicationUser?> ValidateSecurityStampAsync(ClaimsPrincipal? principal)
    {
        // Get user data based on principal and not the UserStore during authentication
        if(principal is not null)
        {
            var tokenExpiration = principal.GetTokenExpiresAt();

            if (tokenExpiration <= DateTime.UtcNow)
                return default;

            var token = principal.GetAuthToken();

            if (token is not null)
            {
                var user = await GetUserByTokenAsync(token);                

                if (await ValidateSecurityStampAsync(user, principal.FindFirstValue(Options.ClaimsIdentity.SecurityStampClaimType)))
                {
                    user.AuthToken = token;
                    user.RefreshAuthToken = principal.GetRefreshAuthToken();
                    user.TokenExpiresAt = tokenExpiration;
                    return user;
                }
            }

            return default;
        }        

        return await base.ValidateSecurityStampAsync(principal);
    }

    private async Task<ApplicationUser> GetUserByTokenAsync(string authorizationToken)
    {
        var user = await apiClient.GetUserInfoWithTokenAsync(authorizationToken);

        return user!.MapFromUserContract();
    }
}