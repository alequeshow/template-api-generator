namespace Template.Core.Security;

public class TokenResult
{
    public required string Token { get; set; }

    public required DateTime ExpiresAt { get; set; }
}
