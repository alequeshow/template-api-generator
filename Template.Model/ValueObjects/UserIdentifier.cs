namespace Template.Model.ValueObjects;

public record UserIdentifier
{
    public string Identifier { get; private set;  }

    public UserIdentifier(string id)
    {
        Identifier = id.ToLowerInvariant();
    }
}
