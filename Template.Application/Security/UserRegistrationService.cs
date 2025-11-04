using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using Template.Contract.Authentication;
using Template.Model;
using Template.Model.Interfaces;
using Template.Model.Interfaces.Validators;
using Template.Model.ValueObjects;

namespace Template.Application.Security;

/// <summary>
/// Implementation of user registration service.
/// </summary>
public class UserRegistrationService(
    IUserValidator userValidation,
    IRepository<User, string> userRepository,
    IRepository<UserAccessInfo, string> accessInfoRepository,
    IPasswordHasher passwordHasher,
    ILogger<UserRegistrationService>? logger = null) : IUserRegistrationService
{
    public async Task<RegistrationResult> RegisterUserAsync(UserRegistrationRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            // Validate input
            ValidateRegistrationRequest(request);

            // Scenario 1: No user exists - Create new user and access info
            var creationResult = await TryCreateNewUserAsync(request);

            if (creationResult.IsSuccessful)
                return creationResult;

            // Check if user exists by username or email
            var existingUserByUsername = await FindUserByUsernameAsync(request.UserIdentifier);
            var existingUserByEmail = await FindUserByEmailAsync(request.Email);

            // Scenario 2: User exists with matching username AND email
            if (existingUserByUsername != null && existingUserByEmail != null &&
                existingUserByUsername.Id == existingUserByEmail.Id)
            {
                var user = existingUserByUsername;
                var accessInfo = await FindAccessInfoByUserIdAsync(user.Id);

                // Scenario 2a: User exists but no access info - Complete registration
                if (accessInfo == null)
                {
                    return await CompleteUserRegistrationAsync(user, request);
                }

                // Scenario 2b: User fully registered - Deny registration
                logger?.LogWarning("Registration attempt for already registered user. Id: {Id}, UserIdentifier: {UserIdentifier}",
                    user.Id, user.UserId.Identifier);

                return new RegistrationResult
                {
                    IsSuccessful = false,
                    Status = UserRegistrationStatus.UserAlreadyRegistered,
                    Message = "User is already registered."
                };
            }

            // Scenario 3: Partial match (username or email exists but not both) - Requires reset
            logger?.LogWarning("Registration attempt with partial match. UserIdentifier: {UserIdentifier}, Email: {Email}",
                request.UserIdentifier, request.Email);

            return new RegistrationResult
            {
                IsSuccessful = false,
                Status = UserRegistrationStatus.PartialMatchRequiresReset,
                Message = "Username or email is already associated with an account."
            };
        }        
        catch (Exception ex) when (ex is not ArgumentException)
        {
            logger?.LogError(ex, "Error during user registration. UserIdentifier: {UserIdentifier}, Email: {Email}", request.UserIdentifier, request.Email);

            throw;
        }
    }

    public async Task<bool> IsUsernameOrEmailAvailableAsync(string username, string email, CancellationToken cancellationToken = default)
    {
        var userByUsername = await FindUserByUsernameAsync(username);
        var userByEmail = await FindUserByEmailAsync(email);

        return userByUsername == null && userByEmail == null;
    }

    private static void ValidateRegistrationRequest(UserRegistrationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserIdentifier))
            throw new ArgumentException("Username is required.", nameof(request));

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email is required.", nameof(request));

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Password is required.", nameof(request));

        if (string.IsNullOrWhiteSpace(request.FirstName))
            throw new ArgumentException("First name is required.", nameof(request));

        if (string.IsNullOrWhiteSpace(request.LastName))
            throw new ArgumentException("Last name is required.", nameof(request));
    }

    [SuppressMessage("Performance",
        "CA1862:Use the 'StringComparison' method overloads to perform case-insensitive string comparisons",
        Justification = "StringComparison is not available in MongoDB.Driver.Linq")]
    private async Task<User?> FindUserByUsernameAsync(string username)
    {
        var users = await userRepository.ListAsync(u =>
            u.UserId.Identifier == username.ToLowerInvariant());
        return users.FirstOrDefault();
    }

    [SuppressMessage("Performance",
        "CA1862:Use the 'StringComparison' method overloads to perform case-insensitive string comparisons",
        Justification = "StringComparison is not available in MongoDB.Driver.Linq")]
    private async Task<User?> FindUserByEmailAsync(string email)
    {
        var users = await userRepository.ListAsync(u =>
            u.Email.Value == email.ToLowerInvariant());
        return users.FirstOrDefault();
    }

    private async Task<UserAccessInfo?> FindAccessInfoByUserIdAsync(string userId)
    {
        var accessInfos = await accessInfoRepository.ListAsync(a => a.UserId == userId);
        return accessInfos.FirstOrDefault();
    }

    private async Task<RegistrationResult> TryCreateNewUserAsync(UserRegistrationRequest request)
    {
        // Create User entity
        var user = new User
        {
            Id = null!,
            UserId = new UserIdentifier(request.UserIdentifier),
            Name = new PersonName(request.FirstName, request.LastName),
            Email = new Email(request.Email),
            ActiveInfo = new()
        };

        var validationResult = await userValidation.ValidateForAddAsync(user);

        if (validationResult is not null)
        {
            var status = validationResult.Select(v => v.Key).Distinct().ToList().Contains("NotUnique")
                    ? UserRegistrationStatus.UserAlreadyRegistered
                    : UserRegistrationStatus.InvalidData;

            return new RegistrationResult
            {
                IsSuccessful = false,
                Status = status,
                Message = string.Join(", ", validationResult.Select(v => v.Message).Distinct().ToList()),
            };
        }

        await userRepository.AddAsync(user);

        // Create UserAccessInfo entity
        var accessInfo = new UserAccessInfo
        {
            Id = null!,
            UserId = user.Id,
            PasswordHash = passwordHasher.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow            
        };

        await accessInfoRepository.AddAsync(accessInfo);

        logger?.LogInformation("New user registered successfully. Id: {Id}, UserIdentifier: {UserIdentifier}",
            user.Id, user.UserId.Identifier);

        return new RegistrationResult
        {
            IsSuccessful = true,
            UserId = user.Id,
            Status = UserRegistrationStatus.Success,
            Message = "User registered successfully."
        };
    }

    private async Task<RegistrationResult> CompleteUserRegistrationAsync(User user, UserRegistrationRequest request)
    {
        // Create UserAccessInfo for existing user
        var accessInfo = new UserAccessInfo
        {
            Id = null!,
            UserId = user.Id,
            PasswordHash = passwordHasher.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        await accessInfoRepository.AddAsync(accessInfo);

        // Update user to active if not already
        if (!user.ActiveInfo.IsActive)
        {
            user.ActiveInfo.Reactivate();

            await userRepository.UpdateAsync(user);
        }

        logger?.LogInformation("User registration completed. Id: {Id}, UserIdentifier: {UserIdentifier}",
            user.Id, user.UserId.Identifier);

        return new RegistrationResult
        {
            IsSuccessful = true,
            UserId = user.Id,
            Status = UserRegistrationStatus.Success,
            Message = "Registration completed successfully."
        };
    }
}