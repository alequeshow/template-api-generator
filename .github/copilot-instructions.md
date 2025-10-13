# Template API Generator Instructions

This repository contains a template-based API generator that scaffolds complete .NET solutions from JSON schemas.

## Template Structure

The template uses a layered architecture:
- **Template.Api**: Web API with minimal endpoints
- **Template.Application**: Command/Query handlers (CQRS pattern)
- **Template.Contract**: DTOs for API communication
- **Template.Model**: Domain entities
- **Template.Repository**: Data access layer
- **Template.DatabaseFactory**: MongoDB implementation

## Code Generation Rules

When generating code from JSON schemas:

1. **DO NOT refactor or optimize** existing template code
2. **DO NOT change** the architectural patterns used
3. **COPY the exact structure** from Template.* projects
4. **REPLACE ONLY** the namespace prefix and entity-specific code
5. **MAINTAIN** all existing patterns (error handling, dependency injection, etc.)
6. **KEEP** MongoDB as the database technology

## Entity Generation Pattern

For each JSON schema titled "EntityName":

### Model Layer (*.Model project)
- Create `EntityName.cs` inheriting from `EntityModel`
- Map JSON schema properties to C# properties
- Use required/optional based on schema's "required" array
- Type mappings:
  - `string` → `string`
  - `number` → `decimal` or `double`
  - `integer` → `int` or `long`
  - `boolean` → `bool`
  - `string` with `format: "date-time"` → `DateTime`
  - `array` → `List<T>` or nested class
  - `object` → nested class

### Contract Layer (*.Contract project)
- Create `EntityName.cs` as POCO (plain DTO)
- Make `Id` property nullable (`string?`)
- Copy same properties as Model but without inheritance

### Repository Layer (*.Repository project)
- In `ServiceCollectionExtensions.cs`, add:
  ```csharp
  .AddMongoRepository<EntityName>();
  ```

### Application Layer (*.Application project)
- Create `EntityNameQueryHandler.cs` implementing both:
  - `IQueryHandler<QuerySingle<EntityName>, EntityName>`
  - `IQueryHandler<QueryMany<EntityName>, List<EntityName>>`
- Create `EntityNameCommandHandler.cs` implementing:
  - `ICommandHandler<Command<EntityName>, EntityName>`
- Register handlers in `ServiceCollectionExtensions.cs`

### API Layer (*.Api project)
- Create `EntityNameMapper.cs` in `Extensions/EndpointMappers/`
- Implement 5 endpoints following the Status pattern:
  - GET /{entityname}/{id}
  - GET /{entityname}
  - POST /{entityname}
  - PUT /{entityname}/{id}
  - DELETE /{entityname}/{id}
- Register mapper in `WebApplicationExtensions.MapEndpoints()`

## Nested Objects Handling

For nested objects in JSON schema:
- Create a separate class in the same Model file
- Use composition (property of the nested type)
- Apply same type mapping rules

## Example Generation Flow

Given schema with title "Product":
1. Create `Product.cs` in Birthday.Wishlist.Model
2. Create `Product.cs` in Birthday.Wishlist.Contract
3. Add `AddMongoRepository<Product>()` in Repository extensions
4. Create `ProductQueryHandler.cs` in Application/Handlers
5. Create `ProductCommandHandler.cs` in Application/Handlers
6. Register handlers in Application extensions
7. Create `ProductMapper.cs` in Api/Extensions/EndpointMappers
8. Register mapper in Api extensions

## File Naming Conventions

- Use PascalCase for all class names
- Use lowercase for endpoint routes
- Use plural form for collection endpoints (optional, follow Status example)
- Match file names to class names exactly

## Important Notes

- Always inherit Model entities from `EntityModel`
- Always use `IRepository<EntityName, string>` for repositories
- Always use `ApiHandler.HandleEndpointAsync` for endpoints
- Keep the same error handling pattern from Template.Api
- Maintain the same DI registration patterns
