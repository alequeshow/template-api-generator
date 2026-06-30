namespace Template.Contract.Authentication;

public class TokenAuthenticationResult : BaseAuthenticationResult
{
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
}
