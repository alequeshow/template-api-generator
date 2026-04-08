namespace Template.Infrastructure.Configuration;

public class CookieSettings
{
    /// <summary>
    /// Gets the default authentication scheme name used for cookie-based authentication.
    /// It's the same value from Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme
    /// But it's defined here to avoid dependency on Microsoft.AspNetCore.Authentication.Cookies in multiple projects
    /// </summary>
    public static string CookieAuthenticationScheme => "Cookies";
    public required string CookieName { get; set; }
    public bool HttpOnly { get; set; } = true;
    public int ExpirationMinutes { get; set; } = 60;
    public int MaxAgeInDays { get; set; } = 7;
}