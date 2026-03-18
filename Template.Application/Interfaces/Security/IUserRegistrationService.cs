using Template.Contract.Authentication;

namespace Template.Application.Interfaces.Security;

/// <summary>
/// Service for handling user registration.
/// </summary>
public interface IUserRegistrationService
{
    /// <summary>
    /// Registers a new user with the provided information.
    /// </summary>
    Task<UserRegistrationResult> RegisterUserAsync(UserRegistrationRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates if a username or email is available for registration.
    /// </summary>
    Task<bool> IsUsernameOrEmailAvailableAsync(string username, string email, CancellationToken cancellationToken = default);
}