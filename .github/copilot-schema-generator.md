# Schema-Based Code Generation Guide

## IMPORTANT: Start Creating Files Immediately

**DO NOT output code in chat. Create files directly using tools.**

When you receive a generation request:
1. ❌ DO NOT preview code in chat
2. ❌ DO NOT show examples of what you'll create
3. ✅ DO read the schema file
4. ✅ DO start creating files immediately
5. ✅ DO provide brief progress updates only ("Creating 15 files...")
6. ✅ DO summarize after completion

## Step-by-Step Generation Process

When asked to generate a new solution from a JSON schema file:

### Step 1: Parse Input
- Read the solution name (e.g., "Birthday.Wishlist")
- Read the JSON schema file path
- Extract all schema objects with their "title" property

### Step 2: Create Solution Structure
```
{SolutionName}/
  {SolutionName}.sln
  {SolutionName}.Api/
  {SolutionName}.Application/
  {SolutionName}.Contract/
  {SolutionName}.DatabaseFactory/
  {SolutionName}.Model/
  {SolutionName}.Repository/
  .vscode/                    (COPY FROM TEMPLATE)
  mongo-init/                 (COPY FROM TEMPLATE)
  .dockerignore              (COPY FROM TEMPLATE)
  .env_template              (COPY FROM TEMPLATE)
  .gitignore                 (COPY FROM TEMPLATE)
  docker-compose.yml         (COPY FROM TEMPLATE, UPDATE PROJECT NAMES)
```

### Step 3: Copy Local Development Files (DO THIS FIRST)

Copy these files from template root to new solution root, updating namespaces/project names:

**Local Development (COPY ALWAYS):**
- `.vscode/launch.json` - Update project paths from "Template.Api" to "{SolutionName}.Api"
- `.vscode/tasks.json` - Update project paths from "Template.Api" to "{SolutionName}.Api"
- `.vscode/extensions.json` - Copy as-is
- `mongo-init/01-init.js` - Update database name from "TemplateDb" to "{SolutionName}Db"
- `.dockerignore` - Copy as-is
- `.env_template` - Update ConnectionStrings__DefaultConnection database name
- `.gitignore` - Copy as-is
- `docker-compose.yml` - Update service names and database name

#### Example Updates Required:

**docker-compose.yml:**
```yaml
# Change service name from:
template-api:
  # to:
birthday-wishlist-api:

# Change image name from:
image: template-api
  # to:
image: birthday-wishlist-api

# Update paths from Template.Api to {SolutionName}.Api
```

**.vscode/launch.json:**
```json
// Update all occurrences of "Template.Api" to "{SolutionName}.Api"
"program": "${workspaceFolder}/Birthday.Wishlist.Api/bin/Debug/net8.0/Birthday.Wishlist.Api.dll"
```

**.vscode/tasks.json:**
```json
// Update project path in all tasks
"${workspaceFolder}/Birthday.Wishlist.Api/Birthday.Wishlist.Api.csproj"
```

**mongo-init/01-init.js:**
```javascript
// Change database name from:
db = db.getSiblingDB('TemplateDb');
// to:
db = db.getSiblingDB('BirthdayWishlistDb');
```

**.env_template:**
```
# Update connection string database name
ConnectionStrings__DefaultConnection=mongodb://root:example@localhost:27017/BirthdayWishlistDb?authSource=admin
```

### Step 4: Copy Template Files

For each project, copy these files from Template.* and replace namespace:

**{SolutionName}.Api:**
- `Template.Api/Program.cs`
- `Template.Api/appsettings.json`
- `Template.Api/appsettings.Development.json`
- `Template.Api/Properties/launchSettings.json`
- `Template.Api/Configuration/AppConfiguration.cs`
- `Template.Api/Extensions/ServiceCollectionExtensions.cs`
- `Template.Api/Extensions/WebApplicationExtensions.cs`
- `Template.Api/Handlers/ApiHandler.cs`
- `Template.Api/Extensions/EndpointMappers/AuthenticationMapper.cs` (ALWAYS COPY)
- `Template.Api/Extensions/EndpointMappers/UserMapper.cs` (ALWAYS COPY)
- {SolutionName}.Api.csproj

**{SolutionName}.Application:**
- `Template.Application/Commands/Command.cs`
- `Template.Application/Commands/CommandOperation.cs`
- `Template.Application/Queries/QuerySingle.cs`
- `Template.Application/Queries/QueryMany.cs`
- `Template.Application/Handlers/ICommandHandler.cs`
- `Template.Application/Handlers/IQueryHandler.cs`
- `Template.Application/Handlers/UserQueryHandler.cs` (ALWAYS COPY)
- `Template.Application/Handlers/UserCommandHandler.cs` (ALWAYS COPY)
- `Template.Application/Security/IAuthenticationService.cs` (ALWAYS COPY)
- `Template.Application/Security/IPasswordHasher.cs` (ALWAYS COPY)
- `Template.Application/Security/ITokenService.cs` (ALWAYS COPY)
- `Template.Application/Security/IUserRegistrationService.cs` (ALWAYS COPY)
- `Template.Application/Security/AuthenticationService.cs` (ALWAYS COPY)
- `Template.Application/Security/PasswordHasher.cs` (ALWAYS COPY)
- `Template.Application/Security/TokenService.cs` (ALWAYS COPY)
- `Template.Application/Security/UserRegistrationService.cs` (ALWAYS COPY)
- `Template.Application/Extensions/ServiceCollectionExtensions.cs`
- {SolutionName}.Application.csproj

**{SolutionName}.Contract:**
- `Template.Contract/User.cs` (ALWAYS COPY)
- `Template.Contract/Authentication/AuthenticationResult.cs` (ALWAYS COPY)
- `Template.Contract/Authentication/RefreshTokenRequest.cs` (ALWAYS COPY)
- `Template.Contract/Authentication/UserCredentialsRequest.cs` (ALWAYS COPY)
- `Template.Contract/Authentication/UserRegistrationRequest.cs` (ALWAYS COPY)
- `Template.Contract/Authentication/UserRegistrationResult.cs` (ALWAYS COPY)
- `Template.Contract/Authentication/UserRegistrationStatus.cs` (ALWAYS COPY)
- {SolutionName}.Contract.csproj

**{SolutionName}.Model:**
- `Template.Model/EntityModel.cs`
- `Template.Model/Interfaces/IEntity.cs`
- `Template.Model/Interfaces/IRepository.cs`
- `Template.Model/Exceptions/ResourceNotFoundException.cs`
- `Template.Model/User.cs` (ALWAYS COPY)
- `Template.Model/UserAccessInfo.cs` (ALWAYS COPY)
- `Template.Model/ValueObjects/PersonName.cs` (ALWAYS COPY)
- `Template.Model/ValueObjects/Email.cs` (ALWAYS COPY)
- `Template.Model/ValueObjects/UserIdentifier.cs` (ALWAYS COPY)
- `Template.Model/ValueObjects/ActiveInfo.cs` (ALWAYS COPY)
- {SolutionName}.Model.csproj

**{SolutionName}.Repository:**
- `Template.Repository/Extensions/ServiceCollectionExtensions.cs`
- {SolutionName}.Repository.csproj

**{SolutionName}.DatabaseFactory:**
- `Template.DatabaseFactory/Mongo/MongoRepository.cs`
- `Template.DatabaseFactory/Mongo/Configuration/MongoConfiguration.cs`
- `Template.DatabaseFactory/Mongo/Extensions/ServiceCollectionExtensions.cs`
- {SolutionName}.DatabaseFactory.csproj

### Step 5: Generate Entity-Specific Code

For each schema in the input file:

1. **Generate Model** (use exact pattern from Status.cs)
2. **Generate Contract** (use exact pattern from Template.Contract/Status.cs)
3. **Generate Query Handler** (use exact pattern from StatusQueryHandler.cs)
4. **Generate Command Handler** (use exact pattern from StatusCommandHandler.cs)
5. **Generate API Mapper** (use exact pattern from StatusMapper.cs)

### Step 6: Register Components

Update these files to include all entities:

**{SolutionName}.Repository/Extensions/ServiceCollectionExtensions.cs:**
```csharp
services
    .ConfigureMongoDatabase()
    .AddMongoRepository<User>()           // ALWAYS INCLUDE
    .AddMongoRepository<UserAccessInfo>()  // ALWAYS INCLUDE
    .AddMongoRepository<Entity1>()
    .AddMongoRepository<Entity2>()
    // ... for each entity from schema
    ;
```

**{SolutionName}.Application/Extensions/ServiceCollectionExtensions.cs:**
```csharp
// Handlers
services.AddScoped<UserQueryHandler>();    // ALWAYS INCLUDE
services.AddScoped<UserCommandHandler>();  // ALWAYS INCLUDE
services.AddScoped<Entity1QueryHandler>();
services.AddScoped<Entity1CommandHandler>();
services.AddScoped<Entity2QueryHandler>();
services.AddScoped<Entity2CommandHandler>();
// ... for each entity from schema

// Authentication services - ALWAYS INCLUDE
services.AddSingleton<IPasswordHasher, PasswordHasher>();
services.AddScoped<ITokenService, TokenService>();
services.AddScoped<IAuthenticationService, AuthenticationService>();
services.AddScoped<IUserRegistrationService, UserRegistrationService>();
```

**{SolutionName}.Api/Extensions/WebApplicationExtensions.cs:**
```csharp
app
    .MapAuthenticationEndpoint()  // ALWAYS INCLUDE
    .MapUserEndpoint()           // ALWAYS INCLUDE
    .MapEntity1Endpoint()
    .MapEntity2Endpoint()
    // ... for each entity from schema
    ;
```

### Step 7: Type Conversion Rules

Apply these conversions from JSON schema to C#:

```
JSON Schema Type          → C# Type
---------------------------------------
string                    → string
string (format: email)    → string
string (format: date-time)→ DateTime
number                    → decimal
integer                   → int
boolean                   → bool
array of primitives       → List<T>
array of objects          → List<NestedClass>
object                    → nested class
```

### Step 8: Property Attributes

- If property is in "required" array: use `required` keyword
- If property is NOT in "required" array: make nullable with `?`
- Id property in Contract: always `string?`
- Id property in Model: always `required string`

### Step 9: Validation

After generation, ensure:
- [ ] All namespaces use the new solution name
- [ ] All entities are registered in DI
- [ ] All endpoints follow the same pattern as Status
- [ ] Project references are correct in .csproj files
- [ ] Solution file includes all projects
- [ ] Authentication system is complete (User, UserAccessInfo, all Security services)
- [ ] Value Objects are copied (PersonName, Email, UserIdentifier, ActiveInfo)
- [ ] Authentication and User endpoints are registered
- [ ] Local development files are copied (.vscode, mongo-init, docker-compose.yml, etc.)
- [ ] Project names updated in docker-compose.yml and .vscode files
- [ ] Database name updated in mongo-init/01-init.js and .env_template

## Type Mapping Examples

**Simple Property:**
```json
"name": { "type": "string" }
```
→
```csharp
public required string Name { get; set; }
```

**Optional Property:**
```json
"description": { "type": "string" }
// (not in "required" array)
```
→
```csharp
public string? Description { get; set; }
```

**Date Property:**
```json
"createdAt": { "type": "string", "format": "date-time" }
```
→
```csharp
public DateTime CreatedAt { get; set; }
```

**Array Property:**
```json
"tags": { "type": "array", "items": { "type": "string" } }
```
→
```csharp
public List<string> Tags { get; set; } = [];
```

**Nested Object:**
```json
"items": {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "productId": { "type": "string" },
      "name": { "type": "string" }
    }
  }
}
```
→
```csharp
public List<WishlistItem> Items { get; set; } = [];

public class WishlistItem
{
    public required string ProductId { get; set; }
    public required string Name { get; set; }
}
```

## Value Objects in User Entity

The User entity uses Value Objects (C# records) to encapsulate domain concepts:

### PersonName Value Object
```csharp
public record PersonName
{
    public string FirstName { get; init; }
    public string LastName { get; init; }

    public PersonName(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }
}
```

### Email Value Object
```csharp
public record Email
{
    public string Value { get; private set; }

    public Email(string email)
    {
        Value = email.ToLowerInvariant();
    }
}
```

### UserIdentifier Value Object
```csharp
public record UserIdentifier
{
    public string Identifier { get; private set; }

    public UserIdentifier(string id)
    {
        Identifier = id.ToLowerInvariant();
    }
}
```

### ActiveInfo Value Object
```csharp
public record ActiveInfo
{
    public bool IsActive { get; private set; }
    public DateTime IsActiveFrom { get; private set; }
    public DateTime? DeactivatedSince { get; private set; }

    public ActiveInfo()
    {
        IsActive = true;
        IsActiveFrom = DateTime.UtcNow;
    }

    public void Deactivate() { /* implementation */ }
    public void Reactivate() { /* implementation */ }
}
```

**CRITICAL**: These Value Objects MUST be copied to every generated solution. The User entity in Template.Model uses them, and the Contract/User flattens them for API communication.

## DO NOT

- ❌ Change the architecture or patterns
- ❌ Add new features not in the template
- ❌ Optimize or refactor the template code
- ❌ Change MongoDB to another database
- ❌ Modify the CQRS pattern implementation
- ❌ Change the error handling approach
- ❌ Add validation attributes (keep POCOs clean)
- ❌ Add business logic to entities
- ❌ Skip copying authentication system
- ❌ Modify Value Objects pattern
- ❌ Change JWT implementation
- ❌ Skip User or UserAccessInfo entities
- ❌ Skip local development files (.vscode, docker-compose.yml, etc.)
- ❌ Forget to update project names in copied config files

## DO

- ✅ Copy exact patterns from Template.* Status implementation
- ✅ Use the same file structure
- ✅ Follow the same naming conventions
- ✅ Keep the same dependency injection patterns
- ✅ Maintain the same API response patterns
- ✅ Use the same endpoint routing structure
- ✅ Copy ALL authentication files (marked with "ALWAYS COPY")
- ✅ Copy ALL Value Objects from Template.Model/ValueObjects
- ✅ Include User and UserAccessInfo in every solution
- ✅ Register all authentication services in DI
- ✅ Map authentication endpoints in WebApplicationExtensions
- ✅ Copy ALL local development files (.vscode/, mongo-init/, docker-compose.yml, etc.)
- ✅ Update project names in docker-compose.yml and .vscode files
- ✅ Update database name in mongo-init/01-init.js
