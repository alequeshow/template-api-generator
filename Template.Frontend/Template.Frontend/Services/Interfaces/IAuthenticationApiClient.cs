using Refit;
using Template.Contract;
using Template.Contract.Authentication;
using Template.Contract.Common;

namespace Template.Frontend.Services.Interfaces;

public interface IAuthenticationApiClient
{
    [Post("/auth/cookie")]
    Task<CookieAuthenticationResult> SignInCookieAsync(UserCredentialsRequest userCredentials);

    [Post("/auth/cookie/signout")]
    Task SignOutCookieAsync();

    [Post("/auth/userinfo")]
    Task<User> GetUserInfoAsync();

    [Post("/auth/register")]
    Task<Result<string>> RegisterUserAsync(UserRegistrationRequest request);
}
