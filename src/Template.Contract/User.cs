namespace Template.Contract;

public class User
{
    public string? Id { get; set; }

    public required string UserId { get; set; }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public required string Email { get; set; }

    public bool IsActive { get; set; }

    public DateTime IsActiveFrom { get; set; }

    public DateTime? DeactivatedSince { get; set; }

}