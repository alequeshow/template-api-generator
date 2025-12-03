namespace Template.Contract.Authentication;

public abstract class BaseAuthenticationResult
{
    public bool IsAuthenticated { get; set; }    
    public DateTime? ExpiresAt { get; set; }
    public string? UserId { get; set; }
    public string? ErrorMessage { get; set; }
}
