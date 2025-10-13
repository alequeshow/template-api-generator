# Schema-Based Code Generation Guide

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
```

### Step 3: Copy Template Files

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
- {SolutionName}.Api.csproj

**{SolutionName}.Application:**
- `Template.Application/Commands/Command.cs`
- `Template.Application/Commands/CommandOperation.cs`
- `Template.Application/Queries/QuerySingle.cs`
- `Template.Application/Queries/QueryMany.cs`
- `Template.Application/Handlers/ICommandHandler.cs`
- `Template.Application/Handlers/IQueryHandler.cs`
- `Template.Application/Extensions/ServiceCollectionExtensions.cs`
- {SolutionName}.Application.csproj

**{SolutionName}.Contract:**
- {SolutionName}.Contract.csproj

**{SolutionName}.Model:**
- `Template.Model/EntityModel.cs`
- `Template.Model/Interfaces/IEntity.cs`
- `Template.Model/Interfaces/IRepository.cs`
- `Template.Model/Exceptions/ResourceNotFoundException.cs`
- {SolutionName}.Model.csproj

**{SolutionName}.Repository:**
- `Template.Repository/Extensions/ServiceCollectionExtensions.cs`
- {SolutionName}.Repository.csproj

**{SolutionName}.DatabaseFactory:**
- `Template.DatabaseFactory/Mongo/MongoRepository.cs`
- `Template.DatabaseFactory/Mongo/Configuration/MongoConfiguration.cs`
- `Template.DatabaseFactory/Mongo/Extensions/ServiceCollectionExtensions.cs`
- {SolutionName}.DatabaseFactory.csproj

### Step 4: Generate Entity-Specific Code

For each schema in the input file:

1. **Generate Model** (use exact pattern from Status.cs)
2. **Generate Contract** (use exact pattern from Template.Contract/Status.cs)
3. **Generate Query Handler** (use exact pattern from StatusQueryHandler.cs)
4. **Generate Command Handler** (use exact pattern from StatusCommandHandler.cs)
5. **Generate API Mapper** (use exact pattern from StatusMapper.cs)

### Step 5: Register Components

Update these files to include all entities:

**{SolutionName}.Repository/Extensions/ServiceCollectionExtensions.cs:**
```csharp
services
    .ConfigureMongoDatabase()
    .AddMongoRepository<Entity1>()
    .AddMongoRepository<Entity2>()
    // ... for each entity
    ;
```

**{SolutionName}.Application/Extensions/ServiceCollectionExtensions.cs:**
```csharp
services.AddScoped<Entity1QueryHandler>();
services.AddScoped<Entity1CommandHandler>();
services.AddScoped<Entity2QueryHandler>();
services.AddScoped<Entity2CommandHandler>();
// ... for each entity
```

**{SolutionName}.Api/Extensions/WebApplicationExtensions.cs:**
```csharp
app.MapEntity1Endpoint();
app.MapEntity2Endpoint();
// ... for each entity
```

### Step 6: Type Conversion Rules

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

### Step 7: Property Attributes

- If property is in "required" array: use `required` keyword
- If property is NOT in "required" array: make nullable with `?`
- Id property in Contract: always `string?`
- Id property in Model: always `required string`

### Step 8: Validation

After generation, ensure:
- [ ] All namespaces use the new solution name
- [ ] All entities are registered in DI
- [ ] All endpoints follow the same pattern as Status
- [ ] Project references are correct in .csproj files
- [ ] Solution file includes all projects

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

## DO NOT

- ❌ Change the architecture or patterns
- ❌ Add new features not in the template
- ❌ Optimize or refactor the template code
- ❌ Change MongoDB to another database
- ❌ Modify the CQRS pattern implementation
- ❌ Change the error handling approach
- ❌ Add validation attributes (keep POCOs clean)
- ❌ Add business logic to entities

## DO

- ✅ Copy exact patterns from Template.* Status implementation
- ✅ Use the same file structure
- ✅ Follow the same naming conventions
- ✅ Keep the same dependency injection patterns
- ✅ Maintain the same API response patterns
- ✅ Use the same endpoint routing structure
