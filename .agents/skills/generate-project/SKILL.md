---
name: generate-project
description: Scaffolds a complete, runnable .NET solution based on the template-api-generator architecture from a JSON schema and solution name, adapting namespaces, solution structure, docker orchestration, and local development configurations.
---

# Generate Project Skill

Use this skill when you need to generate a new .NET microservice/API solution based on the `template-api-generator` template and one or more JSON schema files.

## Invocation & Inputs

The skill requires:
1. **Schema Path**: Path to a single JSON schema file or a directory of schema files (e.g., `sample-schemas/wishlist.json`).
2. **Solution Name**: PascalCase valid C# identifier / namespace (e.g., `Birthday.Wishlist`).
3. **Optional Flags**:
   - `--no-frontend`: Omit all Blazor frontend projects (`.Frontend`, `.Frontend.Client`), related Razor pages, and API clients, producing an API-only solution.

**Output Destination**: Solutions are generated in `_output/{SolutionName}/` at the repository root.

---

## Core Generation Directives

1. **Work Silently**: Do not stream massive amounts of C# or JSON code into the conversation before writing files. Read the schemas and templates, create the files directly on disk, and provide concise progress updates.
2. **Strict Fidelity**: Do NOT refactor or redesign architectural patterns. Replicate the exact patterns (Minimal APIs, CQRS handlers, MongoDB repository, PBKDF2/JWT security) established in `Template.*`.
3. **Namespace Replacement Only**: Replace `Template.` with `{SolutionName}.` in C# namespaces, project files, and `using` directives. Do not rename internal classes or methods unless they are entity-specific.
4. **Preserve Built-in Authentication**: Every generated solution must include the complete authentication subsystem (`User`, `UserAccessInfo`, `Template.Security` as `{SolutionName}.Security`, authentication handlers, and `/auth/*` endpoints).
5. **Preserve Local Development Files**: Always copy and adapt `.vscode/`, `mongo-init/`, `docker-compose.yml`, and `.env_template`.

---

## Target Solution Layout

All project folders reside under the `src/` directory within the generated solution:

```
_output/{SolutionName}/
├── {SolutionName}.sln                         # Solution file including all src/* projects
├── .vscode/                                   # VS Code launch and task configs
│   ├── launch.json
│   ├── tasks.json
│   └── extensions.json
├── mongo-init/                                # Database initialization
│   └── 01-init.js
├── .dockerignore
├── .env_template
├── .gitignore
├── docker-compose.yml
└── src/
    ├── {SolutionName}.Api/
    ├── {SolutionName}.Application/
    ├── {SolutionName}.Contract/
    ├── {SolutionName}.DatabaseFactory/
    ├── {SolutionName}.Infrastructure/
    ├── {SolutionName}.Model/
    ├── {SolutionName}.Repository/
    ├── {SolutionName}.Security/
    ├── {SolutionName}.Frontend/               # (Omitted if --no-frontend)
    └── {SolutionName}.Frontend.Client/        # (Omitted if --no-frontend)
```

---

## Step-by-Step Execution Workflow

### Step 1: Parse and Validate Inputs
- Verify that the schema file(s) exist and contain valid JSON with entity definitions (`title`, `properties`, `required`).
- Validate that `SolutionName` is a valid C# namespace identifier (e.g., no spaces, special characters, or numeric prefixes).
- Determine whether frontend generation is enabled: `includeFrontend = !args.Contains("--no-frontend")`.
- Derive `{SanitizedSolutionName}` by stripping dots from `SolutionName` (e.g., `Birthday.Wishlist` → `BirthdayWishlist`), used for database names and container names.

### Step 2: Initialize Output Structure
Create the destination directory `_output/{SolutionName}/` and the internal `src/` directory.

### Step 3: Copy & Adapt Local Development Files

Copy development configuration from the repository root to `_output/{SolutionName}/`:

1. **`.vscode/launch.json`**:
   - Update all references from `Template.Api` to `{SolutionName}.Api`.
   - Update DLL path:
     ```json
     "program": "${workspaceFolder}/src/{SolutionName}.Api/bin/Debug/net9.0/{SolutionName}.Api.dll"
     ```
2. **`.vscode/tasks.json`**:
   - Update project path in build/restore tasks:
     ```json
     "${workspaceFolder}/src/{SolutionName}.Api/{SolutionName}.Api.csproj"
     ```
   - Update any solution references from `ApiGenerator.sln` to `{SolutionName}.sln`.
3. **`.vscode/extensions.json`**: Copy as-is.
4. **`mongo-init/01-init.js`**:
   - Update database name to `{SanitizedSolutionName}Db`:
     ```javascript
     db = db.getSiblingDB('{SanitizedSolutionName}Db');
     ```
5. **`.env_template`**:
   - Update connection string database name:
     ```
     ConnectionStrings__DefaultConnection=mongodb://root:example@localhost:27017/{SanitizedSolutionName}Db?authSource=admin
     ```
6. **`docker-compose.yml`**:
   - Change service name from `template-api` to `{kebab-case-solution-name}-api`.
   - Change image name to `{kebab-case-solution-name}-api`.
   - Update Dockerfile build context to `./src/{SolutionName}.Api`.
   - Update MongoDB connection string / database environment variable to `{SanitizedSolutionName}Db`.
7. **`.dockerignore` & `.gitignore`**: Copy as-is.

### Step 4: Copy & Rebrand Template Projects

Copy project directories from `src/` to `_output/{SolutionName}/src/`:

| Source in Template | Destination in Generated Solution | Notes |
|---|---|---|
| `src/Template.Api` | `src/{SolutionName}.Api` | Rename `.csproj` to `{SolutionName}.Api.csproj` |
| `src/Template.Application` | `src/{SolutionName}.Application` | Rename `.csproj` to `{SolutionName}.Application.csproj` |
| `src/Template.Contract` | `src/{SolutionName}.Contract` | Rename `.csproj` to `{SolutionName}.Contract.csproj` |
| `src/Template.DatabaseFactory` | `src/{SolutionName}.DatabaseFactory` | Rename `.csproj` to `{SolutionName}.DatabaseFactory.csproj` |
| `src/Template.Infrastructure` | `src/{SolutionName}.Infrastructure` | Rename `.csproj` to `{SolutionName}.Infrastructure.csproj` |
| `src/Template.Model` | `src/{SolutionName}.Model` | Rename `.csproj` to `{SolutionName}.Model.csproj` |
| `src/Template.Repository` | `src/{SolutionName}.Repository` | Rename `.csproj` to `{SolutionName}.Repository.csproj` |
| `src/Template.Security` | `src/{SolutionName}.Security` | Rename `.csproj` to `{SolutionName}.Security.csproj` |
| `src/Template.Frontend/Template.Frontend` | `src/{SolutionName}.Frontend` | Skip if `--no-frontend` |
| `src/Template.Frontend/Template.Frontend.Client` | `src/{SolutionName}.Frontend.Client` | Skip if `--no-frontend` |

#### Project Reference & Namespace Updates:
- In all C# source files (`.cs`, `.razor`):
  - Replace `namespace Template.` with `namespace {SolutionName}.`
  - Replace `using Template.` with `using {SolutionName}.`
- In all `.csproj` files:
  - Update `ProjectReference` elements to point to the new `{SolutionName}.*` projects using sibling paths (`../{SolutionName}.OtherProject/{SolutionName}.OtherProject.csproj`).
  - Update `<RootNamespace>` and `<AssemblyName>` where applicable.

#### Status Sample Cleanup:
- Remove sample Status files:
  - Remove `Template.Model/Status.cs` (or rename/replace with first schema entity).
  - Remove `Template.Contract/Status.cs`.
  - Remove `Template.Application/Handlers/StatusQueryHandler.cs` and `StatusCommandHandler.cs`.
  - Remove `Template.Api/Extensions/EndpointMappers/StatusMapper.cs`.
  - *(If frontend enabled)* Remove `Components/Pages/Status/` and `IStatusApiClient.cs`.

### Step 5: Generate `{SolutionName}.sln`
Generate a standard .NET 9 solution file at the solution root:
- Include all backend projects with relative path prefix `src/{SolutionName}.ProjectName/{SolutionName}.ProjectName.csproj`.
- Place projects in a solution folder named `src`.
- When `includeFrontend = true`, also include `{SolutionName}.Frontend` and `{SolutionName}.Frontend.Client`.

### Step 6: Generate Schema Entities via `schema-mapper`
For each entity identified in the input JSON schema:
- Follow the rules in [`schema-mapper`](../schema-mapper/SKILL.md) to generate:
  1. `{Entity}.cs` in `{SolutionName}.Model`
  2. `{Entity}.cs` in `{SolutionName}.Contract`
  3. `{Entity}QueryHandler.cs` and `{Entity}CommandHandler.cs` in `{SolutionName}.Application/Handlers`
  4. `{Entity}Mapper.cs` in `{SolutionName}.Api/Extensions/EndpointMappers`
  5. *(If frontend)* `I{Entity}ApiClient.cs` in `{SolutionName}.Frontend/Services/Interfaces/ApiClients`
  6. *(If frontend)* Razor pages (`{Entity}List.razor`, `{Entity}Create.razor`, `{Entity}Edit.razor`, `{Entity}Delete.razor`) in `{SolutionName}.Frontend/Components/Pages/{Entity}`

### Step 7: Update Dependency Injection & Endpoint Wiring

1. **`{SolutionName}.Repository/Extensions/ServiceCollectionExtensions.cs`**:
   ```csharp
   services
       .ConfigureMongoDatabase()
       .AddMongoRepository<User>()
       .AddMongoRepository<UserAccessInfo>()
       .AddMongoRepository<{Entity1}>()
       .AddMongoRepository<{Entity2}>();
   ```

2. **`{SolutionName}.Application/Extensions/ServiceCollectionExtensions.cs`**:
   ```csharp
   // Handlers
   services.AddScoped<UserQueryHandler>();
   services.AddScoped<UserCommandHandler>();
   services.AddScoped<{Entity1}QueryHandler>();
   services.AddScoped<{Entity1}CommandHandler>();

   // Security & Auth Services (ALWAYS INCLUDE)
   services.AddSecurityServices();
   services.AddScoped<IAuthenticationService, AuthenticationService>();
   services.AddScoped<IUserRegistrationService, UserRegistrationService>();
   ```

3. **`{SolutionName}.Api/Extensions/WebApplicationExtensions.cs`**:
   ```csharp
   app
       .MapAuthenticationEndpoint()
       .MapUserEndpoint()
       .Map{Entity1}Endpoint()
       .Map{Entity2}Endpoint();
   ```

4. **`{SolutionName}.Frontend/Extensions/ServiceCollectionExtensions.cs`** *(if frontend)*:
   ```csharp
   services.AddScopedApiClient<IAuthenticationApiClient>();
   services.AddScopedApiClient<I{Entity1}ApiClient>();
   services.AddScopedApiClient<I{Entity2}ApiClient>();
   ```

5. **`{SolutionName}.Frontend/Components/Layout/NavMenu.razor`** *(if frontend)*:
   Add navigation links for each generated entity.

---

## Verification & Validation Checklist

Before finalizing the generated project, verify:
- [ ] Solution root contains `.sln`, `.vscode/`, `mongo-init/`, `docker-compose.yml`, `.env_template`, and `src/`.
- [ ] All `.csproj` projects reside directly under `src/`.
- [ ] No `Template.` namespaces or using directives remain in generated code.
- [ ] `User`, `UserAccessInfo`, and all Value Objects (`PersonName`, `Email`, `UserIdentifier`, `ActiveInfo`) are present.
- [ ] Security project (`{SolutionName}.Security`) is included and referenced.
- [ ] All schema entities are registered in Repository, Application, and Api extensions.
- [ ] Database name in `mongo-init/01-init.js` and `.env_template` matches `{SanitizedSolutionName}Db`.
- [ ] If `--no-frontend` was passed, no frontend projects or frontend references exist in `.sln`.

---

## Summary Output Format

Upon completing generation, report:
- **Solution Name & Location**: `_output/{SolutionName}/`
- **Frontend Included**: Yes / No (`--no-frontend`)
- **Projects Created**: List of all projects in solution
- **Entities Scaffolding**: List of all entities generated from schema
- **Quickstart Instructions**:
  ```bash
  cd _output/{SolutionName}
  docker-compose up -d
  dotnet run --project src/{SolutionName}.Api
  ```
