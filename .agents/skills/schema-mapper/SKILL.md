---
name: schema-mapper
description: Maps JSON schema definitions into strongly-typed C# domain models, DTO contracts, CQRS handlers, API endpoint mappers, and frontend clients/pages across solution layers.
---

# Schema Mapper Skill

Use this skill to convert JSON schema definitions into clean, strongly-typed C# code across all architectural layers of the solution.

## Schema Input Structure

A JSON schema definition typically contains:
- `title`: Name of the entity in PascalCase (e.g., `Wishlist`, `Product`, `CustomerOrder`).
- `type`: Usually `"object"`.
- `properties`: Dictionary of property definitions.
- `required`: Array of property names that are mandatory.

---

## Type Mapping Reference

| JSON Schema Type / Format | C# Type | Nullability & Keywords | Default Assignment |
|---|---|---|---|
| `string` | `string` | `required string` (if required) / `string?` (optional) | None |
| `string` (format: `email`) | `string` | `required string` (if required) / `string?` (optional) | None |
| `string` (format: `date-time`) | `DateTime` | `DateTime` (if required) / `DateTime?` (optional) | None |
| `string` (format: `date`) | `DateTime` | `DateTime` (if required) / `DateTime?` (optional) | None |
| `number` | `decimal` | `decimal` (if required) / `decimal?` (optional) | None |
| `integer` | `int` | `int` (if required) / `int?` (optional) | None |
| `boolean` | `bool` | `bool` (if required) / `bool?` (optional) | None |
| `array` (of primitives) | `List<T>` | `List<T>` | `= [];` |
| `array` (of objects) | `List<NestedClass>` | `List<NestedClass>` | `= [];` |
| `object` (nested) | `NestedClass` | `required NestedClass` (if required) / `NestedClass?` | None |

---

## Layer-by-Layer Generation Rules

For every entity defined in the schema (e.g. `Wishlist`):

### 1. Model Layer (`{SolutionName}.Model/{EntityName}.cs`)

- **Base Class**: Must inherit from `EntityModel`.
- **Primary Key**: Do NOT redeclare `Id`; it is inherited from `EntityModel` as `string Id`.
- **Properties**:
  - Convert property names from camelCase / snake_case to **PascalCase**.
  - Add `required` keyword to properties listed in the schema's `required` array.
  - Mark properties NOT in `required` as nullable (`?`).
  - Arrays are initialized to empty list `= [];`.
  - Nested objects become separate classes declared in the same file or adjacent files.

#### Example:
```csharp
namespace {SolutionName}.Model;

public class Wishlist : EntityModel
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public decimal TargetAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<WishlistItem> Items { get; set; } = [];
}

public class WishlistItem
{
    public required string ProductId { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
}
```

---

### 2. Contract Layer (`{SolutionName}.Contract/{EntityName}.cs`)

- **Pure POCO**: Standalone DTO; does NOT inherit from `EntityModel`.
- **Nullable Id**: Always include `public string? Id { get; set; }`. This allows the DTO to be sent in POST requests before an ID has been generated.
- **Properties**: Mirror properties from the Model, using matching C# types.
- **Nested Classes**: Define corresponding DTO classes for nested structures.

#### Example:
```csharp
namespace {SolutionName}.Contract;

public class Wishlist
{
    public string? Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public decimal TargetAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<WishlistItem> Items { get; set; } = [];
}

public class WishlistItem
{
    public required string ProductId { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
}
```

---

### 3. Repository Layer (`{SolutionName}.Repository`)

Entities are stored via the generic repository pattern backed by MongoDB. No dedicated repository class is needed; simply register the entity in `{SolutionName}.Repository/Extensions/ServiceCollectionExtensions.cs`:

```csharp
services
    .ConfigureMongoDatabase()
    .AddMongoRepository<{EntityName}>();
```

---

### 4. Application Layer (`{SolutionName}.Application/Handlers/`)

Create two handlers for each entity:

#### Query Handler: `{EntityName}QueryHandler.cs`
Implements both `IQueryHandler<QuerySingle<{EntityName}>, {EntityName}>` and `IQueryHandler<QueryMany<{EntityName}>, List<{EntityName}>>`:

```csharp
using {SolutionName}.Application.Queries;
using {SolutionName}.Model;
using {SolutionName}.Model.Interfaces;

namespace {SolutionName}.Application.Handlers;

public class {EntityName}QueryHandler(IRepository<{EntityName}, string> repository) :
    IQueryHandler<QuerySingle<{EntityName}>, {EntityName}>,
    IQueryHandler<QueryMany<{EntityName}>, List<{EntityName}>>
{
    public async Task<{EntityName}> Handle(QuerySingle<{EntityName}> query, CancellationToken cancellationToken = default)
    {
        return await repository.GetByIdAsync(query.Id, cancellationToken);
    }

    public async Task<List<{EntityName}>> Handle(QueryMany<{EntityName}> query, CancellationToken cancellationToken = default)
    {
        return await repository.GetAllAsync(cancellationToken);
    }
}
```

#### Command Handler: `{EntityName}CommandHandler.cs`
Implements `ICommandHandler<Command<{EntityName}>, {EntityName}>`:

```csharp
using {SolutionName}.Application.Commands;
using {SolutionName}.Model;
using {SolutionName}.Model.Interfaces;

namespace {SolutionName}.Application.Handlers;

public class {EntityName}CommandHandler(IRepository<{EntityName}, string> repository) :
    ICommandHandler<Command<{EntityName}>, {EntityName}>
{
    public async Task<{EntityName}> Handle(Command<{EntityName}> command, CancellationToken cancellationToken = default)
    {
        return command.Operation switch
        {
            CommandOperation.Create => await repository.AddAsync(command.Entity, cancellationToken),
            CommandOperation.Update => await repository.UpdateAsync(command.Entity, cancellationToken),
            CommandOperation.Delete => await repository.DeleteAsync(command.Entity.Id, cancellationToken),
            _ => throw new NotSupportedException($"Operation {command.Operation} is not supported.")
        };
    }
}
```

#### Handler Registration:
In `{SolutionName}.Application/Extensions/ServiceCollectionExtensions.cs`:
```csharp
services.AddScoped<{EntityName}QueryHandler>();
services.AddScoped<{EntityName}CommandHandler>();
```

---

### 5. API Layer (`{SolutionName}.Api/Extensions/EndpointMappers/`)

Create `{EntityName}Mapper.cs` exposing 5 REST endpoints using `ApiHandler.HandleEndpointAsync`:
- Endpoint routes use lowercase singular nouns: `/{entityname}` (e.g. `/wishlist`).

```csharp
using {SolutionName}.Api.Handlers;
using {SolutionName}.Application.Commands;
using {SolutionName}.Application.Handlers;
using {SolutionName}.Application.Queries;
using {SolutionName}.Model;
using Microsoft.AspNetCore.Mvc;

namespace {SolutionName}.Api.Extensions.EndpointMappers;

public static class {EntityName}Mapper
{
    public static WebApplication Map{EntityName}Endpoint(this WebApplication app)
    {
        var group = app.MapGroup("/{entityname}")
            .WithTags("{EntityName}");

        group.MapGet("/", async ([FromServices] {EntityName}QueryHandler handler, CancellationToken ct) =>
        {
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new QueryMany<{EntityName}>(), ct));
        });

        group.MapGet("/{id}", async (string id, [FromServices] {EntityName}QueryHandler handler, CancellationToken ct) =>
        {
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new QuerySingle<{EntityName}> { Id = id }, ct));
        });

        group.MapPost("/", async ([FromBody] {EntityName} model, [FromServices] {EntityName}CommandHandler handler, CancellationToken ct) =>
        {
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new Command<{EntityName}> { Entity = model, Operation = CommandOperation.Create }, ct));
        });

        group.MapPut("/{id}", async (string id, [FromBody] {EntityName} model, [FromServices] {EntityName}CommandHandler handler, CancellationToken ct) =>
        {
            model.Id = id;
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new Command<{EntityName}> { Entity = model, Operation = CommandOperation.Update }, ct));
        });

        group.MapDelete("/{id}", async (string id, [FromServices] {EntityName}CommandHandler handler, CancellationToken ct) =>
        {
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new Command<{EntityName}> { Entity = new {EntityName} { Id = id }, Operation = CommandOperation.Delete }, ct));
        });

        return app;
    }
}
```

#### Registration:
In `{SolutionName}.Api/Extensions/WebApplicationExtensions.cs`:
```csharp
app.Map{EntityName}Endpoint();
```

---

### 6. Frontend Layer (When Frontend is Enabled)

#### Refit API Client: `I{EntityName}ApiClient.cs`
Placed in `{SolutionName}.Frontend/Services/Interfaces/ApiClients/`:

```csharp
using Refit;
using {SolutionName}.Contract;

namespace {SolutionName}.Frontend.Services.Interfaces.ApiClients;

public interface I{EntityName}ApiClient
{
    [Get("/{entityname}")]
    Task<IReadOnlyCollection<{EntityName}>> Get{EntityName}Async();

    [Get("/{entityname}/{id}")]
    Task<{EntityName}> Get{EntityName}Async(string id);

    [Post("/{entityname}")]
    Task<string> Add{EntityName}Async([Body] {EntityName} body);

    [Put("/{entityname}/{id}")]
    Task Update{EntityName}Async(string id, [Body] {EntityName} body);

    [Delete("/{entityname}/{id}")]
    Task Delete{EntityName}Async(string id);
}
```

Register in `{SolutionName}.Frontend/Extensions/ServiceCollectionExtensions.cs`:
```csharp
services.AddScopedApiClient<I{EntityName}ApiClient>();
```

#### Blazor Razor Pages
Create a folder under `{SolutionName}.Frontend/Components/Pages/{EntityName}/` containing 4 CRUD pages modeled after the Status pages:
- `{EntityName}List.razor`: Route `/{entityname}`, static SSR or interactive list with links to create/edit/delete.
- `{EntityName}Create.razor`: Route `/{entityname}/create`, `InteractiveServer`, form submission via `Add{EntityName}Async`.
- `{EntityName}Edit.razor`: Route `/{entityname}/edit/{id}`, `InteractiveServer`, loads existing entity and calls `Update{EntityName}Async`.
- `{EntityName}Delete.razor`: Route `/{entityname}/delete/{id}`, `InteractiveServer`, confirmation dialog and call to `Delete{EntityName}Async`.

All pages follow standard security and feedback conventions:
- `@attribute [Authorize]`
- Use `AlertMessage` shared component for feedback
- Call `RedirectAfterDelayAsync` after successful operations

---

## Value Objects Pattern in Domain

Value Objects are used in the domain model to encapsulate and enforce invariants on primitive types.

### Domain Model vs Contract POCO
- **In `{SolutionName}.Model`**: Use C# records with initialization, validation, and domain behavior.
  - `PersonName(FirstName, LastName)`
  - `Email(Value)`: Normalizes email to lowercase.
  - `UserIdentifier(Identifier)`: Normalizes identifier to lowercase.
  - `ActiveInfo()`: Encapsulates `IsActive`, `IsActiveFrom`, `DeactivatedSince`, with `Activate()` and `Deactivate()` methods.
- **In `{SolutionName}.Contract`**: Flattened representation for JSON serialization over the wire.
  - E.g. `User.cs` in Contract exposes plain strings: `FirstName`, `LastName`, `Email`, `UserIdentifier`, and `IsActive` boolean.
