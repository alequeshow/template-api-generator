using MongoDB.Bson.Serialization.Attributes;

namespace Template.DatabaseFactory.Mongo;

/// <summary>
/// "Default" Entity model representation.
/// </summary>
/// <remarks>Entities are assumed to use strings for Id's.</remarks>
public abstract class EntityModel : IEntity<string>
{
    [BsonId]
    public required string Id { get; set; }
}