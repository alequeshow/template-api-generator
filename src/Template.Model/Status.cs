namespace Template.Model;

public class Status : EntityModel
{
    public required string Value { get; set; }

    public string? Description { get; set; }

    public DateTime TimeStamp { get; set; }
}