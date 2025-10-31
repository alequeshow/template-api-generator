using Microsoft.Extensions.Options;
using System.Diagnostics.CodeAnalysis;
using Template.Contract.Authentication;
using Template.Model.Configuration;
using Template.Model.Interfaces;
using Template.Model.Interfaces.Security;

namespace Template.Application.Security;

/// <summary>
/// Authentication service implementation.
/// </summary>
public class AuthenticationService(
    IRepository<Model.User, string> userRepository,
    IRepository<Model.UserAccessInfo, string> userAccessInfoRepository,
    ITokenService tokenService,
    IPasswordHasher passwordHasher,
    IOptions<JwtSettings> jwtSettings) : IAuthenticationService
{
    private readonly JwtSettings _jwtSettings = jwtSettings.Value;

    [SuppressMessage("Performance",
        "CA1862:Use the 'StringComparison' method overloads to perform case-insensitive string comparisons",
        Justification = "StringComparison is not available in MongoDB.Driver.Linq")]
    public async Task<AuthenticationResult> AuthenticateAsync(UserCredentialsRequest credentials, CancellationToken cancellationToken = default)
    {
        // Find user by username (assuming UserId is the username)
        var users = await userRepository.ListAsync(u => 
            u.UserId.Identifier == credentials.UserIdentifier.ToLowerInvariant() ||
            u.Email.Value == credentials.UserIdentifier.ToLowerInvariant()
        );

        var user = users.FirstOrDefault();

        if (user == null)
        {
            return new AuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "Invalid user identifier or password"
            };
        }

        // Get user credentials
        var userCredentials = await userAccessInfoRepository.ListAsync(c => c.UserId == user.Id);
        var userCred = userCredentials.FirstOrDefault();

        if (userCred == null || !passwordHasher.VerifyPassword(credentials.Password, userCred.PasswordHash))
        {
            return new AuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "Invalid user identifier or password"
            };
        }

        // Check if user is active
        if (!user.ActiveInfo.IsActive)
        {
            return new AuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "User account is not active"
            };
        }

        // Generate tokens
        var accessToken = tokenService.GenerateAccessToken(user.Id, user.Email.Value);
        var refreshToken = tokenService.GenerateRefreshToken();

        // Update refresh token and last login
        userCred.RefreshToken = refreshToken;
        userCred.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
        userCred.LastLoginAt = DateTime.UtcNow;
        userCred.UpdatedAt = DateTime.UtcNow;

        await userAccessInfoRepository.UpdateAsync(userCred);

        return new AuthenticationResult
        {
            IsAuthenticated = true,
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
            UserId = user.Id
        };
    }

    public async Task<AuthenticationResult> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        var userId = tokenService.GetUserIdFromToken(request.Token);

        if (string.IsNullOrEmpty(userId))
        {
            return new AuthenticationResult
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
            return new AuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "Invalid or expired refresh token"
            };
        }

        var user = await userRepository.GetByIdAsync(userId);
        if (user == null || !user.ActiveInfo.IsActive)
        {
            return new AuthenticationResult
            {
                IsAuthenticated = false,
                ErrorMessage = "User not found or inactive"
            };
        }

        // Generate new tokens
        var accessToken = tokenService.GenerateAccessToken(user.Id, user.Email.Value);
        var refreshToken = tokenService.GenerateRefreshToken();

        // Update refresh token
        userAccessInfo.RefreshToken = refreshToken;
        userAccessInfo.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
        userAccessInfo.UpdatedAt = DateTime.UtcNow;

        await userAccessInfoRepository.UpdateAsync(userAccessInfo);

        return new AuthenticationResult
        {
            IsAuthenticated = true,
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
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
}
