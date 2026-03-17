using Microsoft.AspNetCore.Http;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Template.Contract;
using Template.Contract.Authentication;
using Template.Security.Interfaces;
using Template.Model.Interfaces;

namespace Template.Application.Security;

/// <summary>
/// Authentication service implementation.
/// </summary>
public class AuthenticationService(
    IRepository<Model.User, string> userRepository,
    IRepository<Model.UserAccessInfo, string> userAccessInfoRepository,
    ITokenService tokenService,
    IPasswordHasher passwordHasher) : Interfaces.Security.IAuthenticationService
{

    public async Task<TokenAuthenticationResult> GetTokenAsync(UserCredentialsRequest credentials, CancellationToken cancellationToken = default)
    {
        var (user, userCred) = await GetVerifiedUserInfoAsync(credentials);

        if (user is not null && !user.ActiveInfo.IsActive)
        {
            throw new UnauthorizedAccessException("User account is not active");
        }

        if (user is null || userCred is null)
        {
            throw new UnauthorizedAccessException("Invalid user identifier or password");
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
            throw new UnauthorizedAccessException("Invalid token");
        }

        var usersAccessInfo = await userAccessInfoRepository.ListAsync(c => c.UserId == userId);
        var userAccessInfo = usersAccessInfo.FirstOrDefault();

        if (userAccessInfo == null ||
            userAccessInfo.RefreshToken != request.RefreshToken ||
            userAccessInfo.RefreshTokenExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token");
        }

        var user = await userRepository.GetByIdAsync(userId);
        if (user == null || !user.ActiveInfo.IsActive)
        {
            throw new UnauthorizedAccessException("User not found or inactive");
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

    public async Task RevokeTokenAsync(ClaimsPrincipal user, CancellationToken cancellationToken = default)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            userId = user.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        await RevokeTokenAsync(userId, cancellationToken);
    }    

    public async Task<User> GetUserInfoAsync(HttpContext httpContext, CancellationToken cancellationToken = default)
    {
        var model = await GetUserFromClaimAsync(httpContext.User);

        return new User
        {
            Id = model.Id,
            UserId = model.UserId.Identifier,
            FirstName = model.Name.FirstName,
            LastName = model.Name.LastName,
            Email = model.Email.Value,
            IsActive = model.ActiveInfo.IsActive,
            IsActiveFrom = model.ActiveInfo.IsActiveFrom,
            DeactivatedSince = model.ActiveInfo.DeactivatedSince,
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

    private async Task<Model.User> GetUserFromClaimAsync(ClaimsPrincipal user)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            userId = user.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        return await userRepository.GetByIdAsync(userId) ?? throw new UnauthorizedAccessException();
    }
}
