namespace Template.Model.ValueObjects;

public record Email
{
    public string Value { get; private set; }

    public Email(string email)
    {
        Value = email;
    }
}
