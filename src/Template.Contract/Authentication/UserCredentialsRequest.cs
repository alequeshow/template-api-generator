namespace Template.Contract.Authentication;

public class UserCredentialsRequest
{
    public required string UserIdentifier { get; set; }
    public required string Password { get; set; }
}
