namespace Template.Contract.Authentication;

public class AuthenticationResult
{
    public bool IsAuthenticated { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public string? UserId { get; set; }
    public string? ErrorMessage { get; set; }
}
