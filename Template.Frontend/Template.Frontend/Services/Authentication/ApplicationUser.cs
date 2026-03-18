using Microsoft.AspNetCore.Identity;

namespace Template.Frontend.Services.Authentication;

public class ApplicationUser : IdentityUser
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? AuthToken { get; set; }
    public string? RefreshAuthToken { get; set; }
    public DateTime? TokenExpiresAt { get; set; }
}
