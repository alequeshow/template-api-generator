using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Template.Contract.Authentication;
using Template.Frontend.Services.Interfaces;
using Template.Infrastructure.Configuration;

namespace Template.Frontend.Services.Authentication;

public class ApiSignInManager(
    UserManager<ApplicationUser> userManager,
    IHttpContextAccessor contextAccessor,
    IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory,
    IOptions<IdentityOptions> optionsAccessor,
    ILogger<SignInManager<ApplicationUser>> logger,
    IAuthenticationSchemeProvider schemes,
    IUserConfirmation<ApplicationUser> confirmation,
    IAuthenticationApiClient apiClient,
    ApiAuthenticationStateProvider authStateProvider) : SignInManager<ApplicationUser>(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
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
            var result = await apiClient.SignInCookieAsync(request);

            if (result.UserId is not null)
            {
                // Change the Authentication approach to reuse service to get a token for cookie creation and inject Cookie service here
                // The idea is the login just provide a token that the cookie service can fetch and validate it to generate the cookie
                // This way we can have a single source of truth for token generation and validation

                //await Context.SignInAsync(AuthenticationScheme, userPrincipal, authenticationProperties ?? new AuthenticationProperties());
                // This is useful for updating claims immediately when hitting MapIdentityApi's /account/info endpoint with cookies.
                //Context.User = userPrincipal;
                authStateProvider.SetAuthenticationState(result);
                return SignInResult.Success;
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during API sign-in for user {UserName}", userName);
            throw;
        }

        return SignInResult.Failed;
    }

    public override async Task SignOutAsync()
    {
        try
        {
            await apiClient.SignOutCookieAsync();
            authStateProvider.MarkUserAsLoggedOut();

            logger.LogInformation("User signed out successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during sign out");
            throw;
        }

        await base.Context.SignOutAsync(CookieSettings.CookieAuthenticationScheme);
    }
}