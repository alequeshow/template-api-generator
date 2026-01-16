namespace Template.Contract.Authentication;

public class CookieAuthenticationResult : BaseAuthenticationResult
{
    public required string Email { get; set; }
}
