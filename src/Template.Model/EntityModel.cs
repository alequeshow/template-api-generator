using Template.Model.Interfaces;

namespace Template.Model;

/// <summary>
/// "Default" Entity model representation.
/// </summary>
/// <remarks>Entities are assumed to use strings for Id's.</remarks>
public abstract class EntityModel : IEntity<string>
{
    public required string Id { get; set; }
}