using Refit;
using Template.Contract;
using Template.Contract.Authentication;
using Template.Contract.Common;

namespace Template.Frontend.Services.Interfaces;

public interface IAuthenticationApiClient
{
    [Post("/auth/token")]
    Task<TokenAuthenticationResult> GetTokenAsync(UserCredentialsRequest userCredentials);

    [Post("/auth/token/refresh")]
    Task<TokenAuthenticationResult> RefreshTokenAsync(UserCredentialsRequest userCredentials);

    [Post("/auth/token/revoke")]
    Task RevokeTokenAsync();

    [Post("/auth/userinfo")]
    Task<User> GetUserInfoAsync();

    [Post("/auth/userinfo")]
    Task<User> GetUserInfoWithTokenAsync([Header("x-authorization")] string authorizationToken);

    [Post("/auth/register")]
    Task<Result<string>> RegisterUserAsync(UserRegistrationRequest request);

    [Put("/user/{id}")]
    Task UpdateUserAsync(string id, User request);
}
