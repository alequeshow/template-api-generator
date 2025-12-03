using System.Diagnostics.CodeAnalysis;
using Template.Application.Interfaces.Security;
using Template.Contract.Authentication;
using Template.Core.Interfaces.Security;
using Template.Model.Interfaces;

namespace Template.Application.Security;

/// <summary>
/// Authentication service implementation.
/// </summary>
public class AuthenticationService(
    IRepository<Model.User, string> userRepository,
    IRepository<Model.UserAccessInfo, string> userAccessInfoRepository,
    ITokenService tokenService,
    ICookieService cookieService,
    IPasswordHasher passwordHasher) : IAuthenticationService
{

    public async Task<TokenAuthenticationResult> GetTokenAsync(UserCredentialsRequest credentials, CancellationToken cancellationToken = default)
    {
        var (user, userCred) = await GetVerifiedUserInfoAsync(credentials);

        if (user is not null && !user.ActiveInfo.IsActive)
        {
            return new TokenAuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "User account is not active"
            };
        }

        if (user is null || userCred is null)
        {
            return new TokenAuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "Invalid user identifier or password"
            };
        }        

        // Generate tokens
        var accessToken = tokenService.GenerateAccessToken(user.Id, user.Email.Value);
        var refreshToken = tokenService.GenerateRefreshToken();

        // Update refresh token and last login
        userCred.RefreshToken = refreshToken.Token;
        userCred.RefreshTokenExpiresAt = refreshToken.ExpiresAt;
        userCred.LastLoginAt = DateTime.UtcNow;
        userCred.UpdatedAt = DateTime.UtcNow;

        await userAccessInfoRepository.UpdateAsync(userCred);

        return new TokenAuthenticationResult
        {
            IsAuthenticated = true,
            Token = accessToken.Token,
            RefreshToken = refreshToken.Token,
            ExpiresAt = accessToken.ExpiresAt,
            UserId = user.Id
        };
    }

    public async Task<TokenAuthenticationResult> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        var userId = tokenService.GetUserIdFromToken(request.Token);

        if (string.IsNullOrEmpty(userId))
        {
            return new TokenAuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "Invalid token"
            };
        }

        var usersAccessInfo = await userAccessInfoRepository.ListAsync(c => c.UserId == userId);
        var userAccessInfo = usersAccessInfo.FirstOrDefault();

        if (userAccessInfo == null ||
            userAccessInfo.RefreshToken != request.RefreshToken ||
            userAccessInfo.RefreshTokenExpiresAt < DateTime.UtcNow)
        {
            return new TokenAuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "Invalid or expired refresh token"
            };
        }

        var user = await userRepository.GetByIdAsync(userId);
        if (user == null || !user.ActiveInfo.IsActive)
        {
            return new TokenAuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "User not found or inactive"
            };
        }

        // Generate new tokens
        var accessToken = tokenService.GenerateAccessToken(user.Id, user.Email.Value);
        var refreshToken = tokenService.GenerateRefreshToken();

        // Update refresh token
        userAccessInfo.RefreshToken = refreshToken.Token;
        userAccessInfo.RefreshTokenExpiresAt = refreshToken.ExpiresAt;
        userAccessInfo.UpdatedAt = DateTime.UtcNow;

        await userAccessInfoRepository.UpdateAsync(userAccessInfo);

        return new TokenAuthenticationResult
        {
            IsAuthenticated = true,
            Token = accessToken.Token,
            RefreshToken = refreshToken.Token,
            ExpiresAt = accessToken.ExpiresAt,
            UserId = user.Id
        };
    }

    public async Task<string?> ValidateTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        return await Task.FromResult(tokenService.GetUserIdFromToken(token));
    }

    public async Task RevokeTokenAsync(string userId, CancellationToken cancellationToken = default)
    {
        var userCredentials = await userAccessInfoRepository.ListAsync(c => c.UserId == userId);
        var userCred = userCredentials.FirstOrDefault();

        if (userCred != null)
        {
            userCred.RefreshToken = null;
            userCred.RefreshTokenExpiresAt = null;
            userCred.UpdatedAt = DateTime.UtcNow;

            await userAccessInfoRepository.UpdateAsync(userCred);
        }
    }

    public async Task<CookieAuthenticationResult> GetCookieAsync(UserCredentialsRequest credentials, CancellationToken cancellationToken = default)
    {
        var (user, userCred) = await GetVerifiedUserInfoAsync(credentials);

        if (user is not null && !user.ActiveInfo.IsActive)
        {
            return new CookieAuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "User account is not active"
            };
        }

        if (user is null || userCred is null)
        {
            return new CookieAuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "Invalid user identifier or password"
            };
        }

        var cookie = cookieService.GenerateAuthCookie(user.Id, user.Email.Value);

        userCred.LastLoginAt = DateTime.UtcNow;
        userCred.UpdatedAt = DateTime.UtcNow;

        await userAccessInfoRepository.UpdateAsync(userCred);

        return new CookieAuthenticationResult
        {
            IsAuthenticated = true,            
            UserId = user.Id,
            ExpiresAt = cookie.ExpiresAt,
            AuthenticationScheme = cookie.AuthenticationScheme,
            Claims = cookie.Claims,
            AuthenticationProperties = cookie.AuthenticationProperties
        };
    }

    [SuppressMessage("Performance",
        "CA1862:Use the 'StringComparison' method overloads to perform case-insensitive string comparisons",
        Justification = "StringComparison is not available in MongoDB.Driver.Linq")]
    private async Task<(Model.User?, Model.UserAccessInfo?)> GetVerifiedUserInfoAsync(UserCredentialsRequest credentials)
    {
        // Find user by username (assuming UserId is the username)
        var users = await userRepository.ListAsync(u => 
            u.UserId.Identifier == credentials.UserIdentifier.ToLowerInvariant() ||
            u.Email.Value == credentials.UserIdentifier.ToLowerInvariant()
        );

        var user = users.FirstOrDefault();

        if (user is null)
            return (null, null);        

        // Get user credentials
        var userCredentials = await userAccessInfoRepository.ListAsync(c => c.UserId == user.Id);
        var userCred = userCredentials.FirstOrDefault();

        if (userCred is null || 
            !user.ActiveInfo.IsActive ||
            !passwordHasher.VerifyPassword(credentials.Password, userCred.PasswordHash))
        {
            return (user, null);
        }

        return (user, userCred);
    }
}
