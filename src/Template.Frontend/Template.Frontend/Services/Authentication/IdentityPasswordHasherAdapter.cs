using Microsoft.AspNetCore.Identity;
using Template.Security.Interfaces;

namespace Template.Frontend.Services.Authentication;

/// <summary>
/// Adapts the custom IPasswordHasher to Identity's IPasswordHasher<ApplicationUser>
/// </summary>
public class IdentityPasswordHasherAdapter(IPasswordHasher customHasher) 
    : IPasswordHasher<ApplicationUser>
{
    public string HashPassword(ApplicationUser user, string password)
    {
        return customHasher.HashPassword(password);
    }

    public PasswordVerificationResult VerifyHashedPassword(
        ApplicationUser user, 
        string hashedPassword, 
        string providedPassword)
    {
        bool isValid = customHasher.VerifyPassword(providedPassword, hashedPassword);
        
        return isValid 
            ? PasswordVerificationResult.Success 
            : PasswordVerificationResult.Failed;
    }
}