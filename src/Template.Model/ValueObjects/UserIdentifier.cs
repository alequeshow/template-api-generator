using System.Text.RegularExpressions;

namespace Template.Model.ValueObjects;

public partial record UserIdentifier
{
    [GeneratedRegex(@"^[a-zA-Z0-9]{1,100}$")]
    private static partial Regex ValidationRegex();

    public string Identifier { get; private set;  }

    public UserIdentifier(string id)
    {
        Identifier = id.ToLowerInvariant();
    }

    public static string ValidationMessage =>
       "UserIdentifier must have only alphanumeric characters and max 100 characters long.";

    public static bool IsValid(UserIdentifier userId)
    {
        if (userId?.Identifier == null)
            return false;

        return ValidationRegex().IsMatch(userId.Identifier);
    }
}
