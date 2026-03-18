namespace Template.Contract.Authentication;

/// <summary>
/// Represents the status of a registration attempt.
/// </summary>
public enum UserRegistrationStatus
{
    Success,
    InvalidData,
    UserAlreadyRegistered,
    PartialMatchRequiresReset
}
