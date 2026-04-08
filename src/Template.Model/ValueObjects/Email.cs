namespace Template.Model.ValueObjects;

public record Email
{
    public string Value { get; private set; }

    public Email(string email)
    {
        Value = email.ToLowerInvariant();
    }

    public static string ValidationMessage =>
        "Email must be a valid email address format and not exceed 254 characters.";

    public static bool IsValid(Email email)
    {
        if(email is null)
            return false;

        if(string.IsNullOrWhiteSpace(email.Value))
            return false;

        if(email.Value.Length > 254)
            return false;

        try
        {
            var addr = new System.Net.Mail.MailAddress(email.Value);
            return addr.Address == email.Value;
        }
        catch
        {
            return false;
        }
    }
}
