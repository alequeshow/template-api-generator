using Template.Model.ValueObjects;

namespace Template.Model;

public class User : EntityModel
{
    public required UserIdentifier UserId { get; set; }

    public required PersonName Name { get; set; }

    public required Email Email { get; set; }

    public required ActiveInfo ActiveInfo { get; set; }
}
