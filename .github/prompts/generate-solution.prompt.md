---
description: "Generate a complete .NET solution from a JSON schema using Template.* patterns. Use when: scaffold new project, generate solution from schema, create new API, new solution."
name: "Generate Solution"
argument-hint: "<schema-path> <SolutionName>  — e.g.: sample-schemas/wishlist.json Birthday.Wishlist"
agent: "agent"
tools: [read, edit, search]
---

Generate a complete .NET solution from a JSON schema file.

**Input**: `$ARGS` — format: `<path-to-schema-file> <SolutionName>`

## Rules
- DO NOT output code to chat before creating files
- DO NOT refactor, optimize, or change any architectural patterns
- DO NOT skip any file marked "ALWAYS COPY"
- ONLY replace the `Template.` namespace prefix with `{SolutionName}.` in C# namespaces and `using` statements; perform other renames/updates only where explicitly described in the steps below
- Create all files silently; report progress as one-line updates only

## Reference Files
Read these before generating — they define all rules and patterns:
- [Generation rules](./../copilot-instructions.md)
- [Step-by-step process](./../copilot-schema-generator.md)

## Execution Steps

**Step 1 — Parse inputs**
Extract `schemaPath` and `solutionName` from `$ARGS`. Read the schema file. Identify all entity titles.

**Step 2 — Scaffold projects** (create .csproj + .sln)
Projects to create: `.Api`, `.Application`, `.Contract`, `.DatabaseFactory`, `.Infrastructure`, `.Model`, `.Repository`, `.Security`, `.Frontend`, `.Frontend.Client`

**Step 3 — Copy dev environment files** (update names/paths)
`.vscode/launch.json`, `.vscode/tasks.json`, `.vscode/extensions.json`, `mongo-init/01-init.js`, `.dockerignore`, `.env_template`, `.gitignore`, `docker-compose.yml`

**Step 4 — Copy fixed template files** (namespace substitution only)
Copy every file listed under "Step 4: Copy Template Files" in copilot-schema-generator.md, including all auth/user/security files marked ALWAYS COPY.

**Step 5 — Generate per-entity files** (one entity at a time)
For each entity from the schema, in order:
1. `{Entity}.cs` in `.Model`
2. `{Entity}.cs` in `.Contract`
3. `{Entity}QueryHandler.cs` + `{Entity}CommandHandler.cs` in `.Application/Handlers`
4. `{Entity}Mapper.cs` in `.Api/Extensions/EndpointMappers`
5. `I{Entity}ApiClient.cs` in `.Frontend/Services/Interfaces/ApiClients`
6. `{Entity}List.razor`, `{Entity}Create.razor`, `{Entity}Edit.razor`, `{Entity}Delete.razor` in `.Frontend/Components/Pages/{Entity}`

**Step 6 — Update registrations**
- `.Repository`: add `AddMongoRepository<{Entity}>()` for each entity + User + UserAccessInfo
- `.Application`: register handlers + `AddSecurityServices()`
- `.Api`: register all endpoint mappers
- `.Frontend`: register all Refit API clients + update NavMenu links

**Step 7 — Validate**
Confirm checklist from Step 9 of copilot-schema-generator.md before finishing.

## Output
After all files are created, summarize:
- Solution name and output folder
- Projects created (count)
- Entities generated from schema (list)
- Next steps: `docker-compose up` → F5 to debug
