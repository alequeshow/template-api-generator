using System.Text.RegularExpressions;

namespace Template.Model.ValueObjects;

public partial record PersonName
{
    [GeneratedRegex(@"^[a-zA-Z\s'-]{1,100}$")]
    private static partial Regex ValidationRegex();

    public string FirstName { get; init; }
    public string LastName { get; init; }

    public PersonName(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }        

    public static string ValidationMessage =>
       "PersonName must have both FirstName and LastName as valid names, with max 100 characters long each. Spaces ( ), dashes (-), and apostrophes (') are allowed.";

    public static bool IsValid(PersonName personName)
    {
        if (personName is null || 
            string.IsNullOrWhiteSpace(personName.FirstName) ||
            string.IsNullOrWhiteSpace(personName.LastName)
        )
            return false;

        return
            ValidationRegex().IsMatch(personName.FirstName) &&
            ValidationRegex().IsMatch(personName.LastName);
    }
}