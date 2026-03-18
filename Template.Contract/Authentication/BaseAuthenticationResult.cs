namespace Template.Contract.Authentication;

public abstract class BaseAuthenticationResult
{
    public DateTime? ExpiresAt { get; set; }
    public string? UserId { get; set; }
}
