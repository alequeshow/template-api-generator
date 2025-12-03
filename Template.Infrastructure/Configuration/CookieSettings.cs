namespace Template.Infrastructure.Configuration;

public class CookieSettings
{
    public required string CookieName { get; set; }
    public bool HttpOnly { get; set; } = true;
    public int ExpirationMinutes { get; set; } = 60;
    public int MaxAgeInDays { get; set; } = 7;
}