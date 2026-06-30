---
description: "Generate a complete .NET solution from a JSON schema using Template.* patterns. Use when: scaffold new project, generate solution from schema, create new API, new solution."
<<<<<<< HEAD
name: "generate-solution"
argument-hint: "<schema-path> <SolutionName>  — e.g.: sample-schemas/ Birthday.Wishlist"
=======
name: "Generate Solution"
argument-hint: "<schema-path> <SolutionName> [--no-frontend]  — e.g.: sample-schemas/wishlist.json Birthday.Wishlist  or  sample-schemas/wishlist.json Birthday.Wishlist --no-frontend"
>>>>>>> origin/main
agent: "agent"
tools: [read, edit, search]
---

Generate a complete .NET solution from a JSON schema file.

<<<<<<< HEAD
**Input**: `$ARGS` — format: `<path-to-schema-files> <SolutionName>`
=======
**Input**: `$ARGS` — format: `<path-to-schema-file> <SolutionName> [--no-frontend]`

- `--no-frontend` is an optional flag. When present, skip all frontend projects (`.Frontend`, `.Frontend.Client`) and all frontend-related files, registrations, and solution references.
>>>>>>> origin/main

## Rules
- DO NOT output code to chat before creating files
- DO NOT refactor, optimize, or change any architectural patterns
- DO NOT skip any file marked "ALWAYS COPY" (unless the `--no-frontend` flag suppresses a frontend-only file)
- ONLY replace the `Template.` namespace prefix with `{SolutionName}.` in C# namespaces and `using` statements, plus perform the specific project/assembly/csproj and project-reference updates explicitly required by copilot-schema-generator.md; do not perform any other renames or refactors
- Create all files silently; report progress as one-line updates only

## Reference Files
Read these before generating — they define all rules and patterns:
- [Generation rules](./../copilot-instructions.md)
- [Step-by-step process](./../copilot-schema-generator.md)

## Execution Steps

**Step 1 — Parse inputs**
<<<<<<< HEAD
Extract `schemaPath` and `solutionName` from `$ARGS`. Read all the schema files in the specified path. Identify all entity titles. The schemas can either be a single file with multiple entities or multiple files with one entity each. Validate that the schema(s) are well-formed and contain the necessary information to generate the solution.

`solutionName` should be a valid C# namespace and project name (e.g., no spaces, special characters, or leading numbers). If the name is invalid, report an error and stop execution.

**Step 2 — Scaffold projects** (create .csproj + .sln)
Projects to create: `.Api`, `.Application`, `.Contract`, `.DatabaseFactory`, `.Infrastructure`, `.Model`, `.Repository`, `.Security`, `.Frontend`, `.Frontend.Client`
All project folders are placed under a `src/` subfolder inside the solution root (e.g., `{SolutionName}/src/{SolutionName}.Api/`). The `.sln`, `.vscode/`, `mongo-init/`, and root dev files stay at the solution root.
For each of these projects, including `.Infrastructure`, scaffold it by copying the corresponding `Template.*` project. For backend and supporting projects, copy from root-level projects (e.g., copy `Template.Infrastructure` to `src/{SolutionName}.Infrastructure/`, update the .csproj and namespaces, and add the project to the solution file with the `src/` prefix path). For frontend projects, copy `Template.Frontend/Template.Frontend` to `src/{SolutionName}.Frontend/` and `Template.Frontend/Template.Frontend.Client` to `src/{SolutionName}.Frontend.Client/`.
=======
Extract `schemaPath`, `solutionName`, and the optional `--no-frontend` flag from `$ARGS`. Set `includeFrontend = true` unless `--no-frontend` is present. Read the schema file. Identify all entity titles.

**Step 2 — Scaffold projects** (create .csproj + .sln)
- Always create: `.Api`, `.Application`, `.Contract`, `.DatabaseFactory`, `.Infrastructure`, `.Model`, `.Repository`, `.Security`
- Only when `includeFrontend = true`: also create `.Frontend` and `.Frontend.Client`

For each of these projects, including `.Infrastructure`, scaffold it by copying the corresponding `Template.*` project. For backend and supporting projects, copy from root-level projects (e.g., copy `Template.Infrastructure` to `{SolutionName}.Infrastructure`, update the .csproj and namespaces, and add the project to the solution file). When `includeFrontend = true`, copy `Template.Frontend/Template.Frontend` to `{SolutionName}.Frontend` and `Template.Frontend/Template.Frontend.Client` to `{SolutionName}.Frontend.Client`, preserving the nested directory structure.
>>>>>>> origin/main

**Step 3 — Copy dev environment files** (update names/paths)
`.vscode/launch.json`, `.vscode/tasks.json`, `.vscode/extensions.json`, `mongo-init/01-init.js`, `.dockerignore`, `.env_template`, `.gitignore`, `docker-compose.yml`

**Step 4 — Copy fixed template files** (namespace substitution + required project/csproj updates)
Copy every file listed under "Step 4: Copy Template Files" in copilot-schema-generator.md, including all auth/user/security files marked ALWAYS COPY. Apply `Template.` → `{SolutionName}.` in C# namespaces and `using` statements, and perform the specific project/assembly/csproj and project-reference updates (e.g., `.Security.csproj` references, `.Frontend` csproj/assembly names) described in copilot-schema-generator.md. Do not perform any other refactors or renames.
- When `includeFrontend = false`: skip all `.Frontend` and `.Frontend.Client` files.

**Step 5 — Generate per-entity files** (one entity at a time)
For each entity from the schema, in order:
1. `{Entity}.cs` in `.Model`
2. `{Entity}.cs` in `.Contract`
3. `{Entity}QueryHandler.cs` + `{Entity}CommandHandler.cs` in `.Application/Handlers`
4. `{Entity}Mapper.cs` in `.Api/Extensions/EndpointMappers`
5. *(only when `includeFrontend = true`)* `I{Entity}ApiClient.cs` in `.Frontend/Services/Interfaces/ApiClients`
6. *(only when `includeFrontend = true`)* `{Entity}List.razor`, `{Entity}Create.razor`, `{Entity}Edit.razor`, `{Entity}Delete.razor` in `.Frontend/Components/Pages/{Entity}`

**Step 6 — Update registrations**
- `.Repository`: add `AddMongoRepository<{Entity}>()` for each entity + User + UserAccessInfo
- `.Application`: register handlers + `AddSecurityServices()` and ALWAYS register `IAuthenticationService` → `AuthenticationService` and `IUserRegistrationService` → `UserRegistrationService` (per copilot-schema-generator.md)
- `.Api`: register all endpoint mappers
- *(only when `includeFrontend = true`)* `.Frontend`: register all Refit API clients + update NavMenu links

**Step 7 — Validate**
Confirm checklist from Step 10 of copilot-schema-generator.md before finishing. When `includeFrontend = false`, skip all frontend checklist items.

## Output
After all files are created, summarize:
- Solution name and output folder
- Whether frontend was included (yes / no — omitted via `--no-frontend`)
- Projects created (count and list)
- Entities generated from schema (list)
- Next steps: `docker-compose up` → F5 to debug
