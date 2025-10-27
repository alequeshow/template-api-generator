# Template API Generator Instructions

This repository contains a template-based API generator that scaffolds complete .NET solutions from JSON schemas.

## Template Structure

The template uses a layered architecture:
- **Template.Api**: Web API with minimal endpoints
- **Template.Application**: Command/Query handlers (CQRS pattern), Security services
- **Template.Contract**: DTOs for API communication, Authentication contracts
- **Template.Model**: Domain entities, Value Objects
- **Template.Repository**: Data access layer
- **Template.DatabaseFactory**: MongoDB implementation

## Built-in Authentication & User Management

The template includes a complete authentication and user management system that should be copied to every generated solution:

### Core Components (COPY ALWAYS)
- **User Entity**: With Value Objects (PersonName, Email, UserIdentifier, ActiveInfo)
- **UserAccessInfo Entity**: For password hashing and refresh tokens
- **Authentication Services**: Login, registration, token refresh, token revocation
- **Security Interfaces**: IAuthenticationService, ITokenService, IPasswordHasher, IUserRegistrationService
- **Authentication Endpoints**: `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/revoke`
- **User CRUD Endpoints**: Standard endpoints for user management with authorization

### Value Objects Pattern
The User entity uses Value Objects (records) for domain concepts:
- `PersonName`: Encapsulates FirstName and LastName
- `Email`: Encapsulates email with lowercase normalization
- `UserIdentifier`: Encapsulates user identifier with lowercase normalization
- `ActiveInfo`: Encapsulates activation state with methods (Activate/Deactivate)

**IMPORTANT**: Always copy these Value Objects when creating User entity in new solutions.

## Code Generation Rules

When generating code from JSON schemas:

1. **DO NOT refactor or optimize** existing template code
2. **DO NOT change** the architectural patterns used
3. **COPY the exact structure** from Template.* projects
4. **REPLACE ONLY** the namespace prefix and entity-specific code
5. **MAINTAIN** all existing patterns (error handling, dependency injection, etc.)
6. **KEEP** MongoDB as the database technology
7. **ALWAYS INCLUDE** the complete authentication system (User, UserAccessInfo, Security services)
8. **ALWAYS COPY** Value Objects when they exist in the template

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
