namespace Template.Contract;

public class Status
{
    public string? Id { get; set; }

    public required string Value { get; set; }

    public string? Description { get; set; }

    public DateTime TimeStamp { get; set; }
}