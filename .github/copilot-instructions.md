# Template API Generator Instructions

This repository contains a template-based API generator that scaffolds complete .NET solutions from JSON schemas.

## Template Structure

The template uses a layered architecture:
- **Template.Api**: Web API with minimal endpoints
- **Template.Application**: Command/Query handlers (CQRS pattern), Authentication services
- **Template.Contract**: DTOs for API communication, Authentication contracts
- **Template.Model**: Domain entities, Value Objects
- **Template.Repository**: Data access layer
- **Template.Infrastructure**: Infrastructure services and cross-cutting concerns
- **Template.DatabaseFactory**: MongoDB implementation
- **Template.Security**: Password hashing (PBKDF2) and JWT token services
- **Template.Frontend**: Blazor Server+WASM hybrid UI with Identity integration
- **Template.Frontend.Client**: Blazor WebAssembly client-side project

## Built-in Authentication & User Management

The template includes a complete authentication and user management system that should be copied to every generated solution:

### Core Components (COPY ALWAYS)
- **User Entity**: With Value Objects (PersonName, Email, UserIdentifier, ActiveInfo)
- **UserAccessInfo Entity**: For password hashing and refresh tokens
- **Authentication Services**: Login, registration, token refresh, token revocation
- **Security Project** (`Template.Security`): `PasswordHasher` (PBKDF2/SHA-256), `TokenService` (JWT), `IPasswordHasher`, `ITokenService`, `TokenResult`, `AddSecurityServices()` extension
- **Security Interfaces** (in Application): `IAuthenticationService`, `IUserRegistrationService`
- **Authentication Endpoints**: `/auth/token`, `/auth/register`, `/auth/token/refresh`, `/auth/token/revoke`, `/auth/userinfo`
- **User CRUD Endpoints**: Standard endpoints for user management with authorization

### Value Objects Pattern
The User entity uses Value Objects (records) for domain concepts:
- `PersonName`: Encapsulates FirstName and LastName
- `Email`: Encapsulates email with lowercase normalization
- `UserIdentifier`: Encapsulates user identifier with lowercase normalization
- `ActiveInfo`: Encapsulates activation state with methods (Reactivate/Deactivate)

**IMPORTANT**: Always copy these Value Objects when creating User entity in new solutions.

## Local Development Files

The template includes development and infrastructure files that must be copied to every generated solution:

### Development Environment (COPY ALWAYS)
- **`.vscode/`** folder: VS Code workspace configuration
  - `launch.json`: Debugging configurations
  - `tasks.json`: Build and run tasks
  - `extensions.json`: Recommended extensions
- **`mongo-init/`** folder: MongoDB initialization scripts
  - `01-init.js`: Database and collection setup
- **`.dockerignore`**: Docker build context exclusions
- **`.env_template`**: Environment variables template
- **`.gitignore`**: Git ignore patterns
- **`docker-compose.yml`**: Docker services orchestration (MongoDB, API)

**IMPORTANT**: These files enable local development with Docker and VS Code debugging. Always copy them to new solutions.

## Frontend Layer (Template.Frontend)

The template includes a complete Blazor Server+WASM hybrid frontend that must be copied to every generated solution:

### Frontend Core Components (COPY ALWAYS)
- **Template.Frontend**: Server-side Blazor host with Identity, auth state serialization, Layout, Account pages (Login, Register, Manage)
- **Template.Frontend.Client**: WASM client project with `RedirectToLogin.razor` and `Auth.razor`
- **Authentication services**: `ApiSignInManager`, `ApiUserStore`, `ApplicationUser`, `AuthTokenForwardingHandler`, `AuthTokenValidationService`, `IdentityPasswordHasherAdapter`
- **Shared components**: `AlertMessage.razor`, `AlertType.cs`
- **`IAuthenticationApiClient`**: Refit client for all auth endpoints (ALWAYS COPY)

### Entity Page Generation (replaces Status pages)
For each entity generated from JSON schema, create 4 Razor pages modelled on the `Status` pages:
- `EntityNameList.razor` — route `/entityname`, static render, calls `GetEntityNameAsync()` in `OnInitializedAsync`
- `EntityNameCreate.razor` — route `/entityname/create`, `InteractiveServer`, calls `AddEntityNameAsync()`
- `EntityNameEdit.razor` — route `/entityname/edit/{id}`, `InteractiveServer`, calls `GetEntityNameAsync(id)` + `UpdateEntityNameAsync()`
- `EntityNameDelete.razor` — route `/entityname/delete/{id}`, `InteractiveServer`, calls `GetEntityNameAsync(id)` + `DeleteEntityNameAsync()`

All pages follow the `Status` page conventions:
- `@attribute [Authorize]`
- `@inject IEntityNameApiClient _entityNameClient`
- `@inject NavigationManager NavigationManager`
- Use `AlertMessage` shared component with `@bind-Message` / `@bind-Type`
- `ShowAlert()` + `RedirectAfterDelayAsync(5000)` helpers

### Entity API Client Generation (replaces IStatusApiClient)
For each entity, create `IEntityNameApiClient.cs` in `Services/Interfaces/ApiClients/` using Refit:
```csharp
[Get("/entityname")]          Task<IReadOnlyCollection<EntityName>> GetEntityNameAsync();
[Post("/entityname")]         Task<string> AddEntityNameAsync([Body] EntityName body);
[Get("/entityname/{id}")]     Task<EntityName> GetEntityNameAsync(string id);
[Put("/entityname/{id}")]     Task UpdateEntityNameAsync(string id, [Body] EntityName body);
[Delete("/entityname/{id}")]  Task DeleteEntityNameAsync(string id);
```
Register via `services.AddScopedApiClient<IEntityNameApiClient>()` in `ServiceCollectionExtensions.cs`.

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
9. **ALWAYS COPY** local development files (.vscode, mongo-init, docker-compose.yml, etc.)
10. **ALWAYS COPY** Template.Security project (PasswordHasher, TokenService, interfaces)
11. **ALWAYS COPY** Template.Frontend and Template.Frontend.Client projects
12. **REPLACE** Status pages with entity-specific pages for each schema entity
13. **CREATE** entity-specific Refit API client interfaces replacing IStatusApiClient

## CRITICAL: Code Generation Behavior

**DO NOT output code in chat before creating files. Start creating files immediately.**

When asked to generate a solution:
- ❌ **DO NOT** show code examples in chat
- ❌ **DO NOT** preview the code you will generate
- ❌ **DO NOT** explain what you will create before creating it
- ✅ **DO** start creating files immediately using file creation tools
- ✅ **DO** work silently and report progress briefly ("Creating files...")
- ✅ **DO** summarize what was created AFTER all files are generated

**Why**: Generating large solutions requires creating many files. Outputting code in chat causes:
1. Output limit reached before file creation starts
2. Wasted tokens on displaying code instead of creating it
3. Incomplete generation requiring restart

**Correct approach**: Read schemas → Immediately start creating files → Brief summary at end

## Entity Generation Pattern

For each JSON schema titled "EntityName":

### Model Layer (*.Model project)
- Create `EntityName.cs` inheriting from `EntityModel`
- Map JSON schema properties to C# properties
- Use required/optional based on schema's "required" array
- Type mappings:
  - `string` → `string`
  - `number` → `decimal`
  - `integer` → `int`
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
9. Create `IProductApiClient.cs` in Frontend/Services/Interfaces/ApiClients
10. Register `IProductApiClient` in Frontend ServiceCollectionExtensions
11. Create `ProductList.razor`, `ProductCreate.razor`, `ProductEdit.razor`, `ProductDelete.razor` in Frontend/Components/Pages/Product

## File Naming Conventions

- Use PascalCase for all class names
- Use lowercase for endpoint routes
- Use the singular entity name for collection/list endpoints following the `/{entityname}` pattern (e.g., `/product`), and keep `/status` singular to match the existing Status endpoints
- Match file names to class names exactly

## Important Notes

- Always inherit Model entities from `EntityModel`
- Always use `IRepository<EntityName, string>` for repositories
- Always use `ApiHandler.HandleEndpointAsync` for endpoints
- Keep the same error handling pattern from Template.Api
- Maintain the same DI registration patterns
