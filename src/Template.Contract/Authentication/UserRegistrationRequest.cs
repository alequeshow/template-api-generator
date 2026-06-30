namespace Template.Contract.Authentication;

/// <summary>
/// Represents a user registration request.
/// </summary>
public class UserRegistrationRequest
{
    public required string UserIdentifier { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}