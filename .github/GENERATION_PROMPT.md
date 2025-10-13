# How to Use This Template Generator

## Prompt Template

Use this prompt with GitHub Copilot:

```
Generate a new solution from JSON schema file located at [PATH_TO_SCHEMA_FILE].

Solution name: [SOLUTION_NAME] (e.g., "Birthday.Wishlist")

Follow the exact patterns from the Template.* projects in this workspace. 

Read the schema file and generate:
1. Solution and project structure
2. Model classes for each schema
3. Contract DTOs for each schema  
4. Repository registrations
5. Query and Command handlers
6. API endpoint mappers
7. Update all service registrations

Place the new solution in a folder named [SOLUTION_NAME] in the repository root.

Reference:
- .github/copilot-instructions.md for generation rules
- .github/copilot-schema-generator.md for step-by-step process
```

## Example Usage

```
Generate a new solution from JSON schema file located at schemas/birthday-wishlist.json.

Solution name: Birthday.Wishlist

Follow the exact patterns from the Template.* projects in this workspace.

Read the schema file and generate:
1. Solution and project structure
2. Model classes for each schema (User, Wishlist)
3. Contract DTOs for each schema
4. Repository registrations
5. Query and Command handlers for User and Wishlist
6. API endpoint mappers for User and Wishlist
7. Update all service registrations

Place the new solution in a folder named Birthday.Wishlist in the repository root.

Reference the generation instructions in .github/copilot-instructions.md and .github/copilot-schema-generator.md.
```

## Example with @workspace mention

```
@workspace Generate a new solution from JSON schema file at schemas/my-schema.json with solution name "MyProject.Name". Follow .github/copilot-instructions.md and .github/copilot-schema-generator.md exactly. Do not refactor or optimize, just copy the Template.* patterns.
```

## Expected Output Structure

```
Birthday.Wishlist/
├── Birthday.Wishlist.sln
├── Birthday.Wishlist.Api/
│   ├── Extensions/
│   │   └── EndpointMappers/
│   │       ├── UserMapper.cs
│   │       └── WishlistMapper.cs
│   └── ...
├── Birthday.Wishlist.Application/
│   ├── Handlers/
│   │   ├── UserQueryHandler.cs
│   │   ├── UserCommandHandler.cs
│   │   ├── WishlistQueryHandler.cs
│   │   └── WishlistCommandHandler.cs
│   └── ...
├── Birthday.Wishlist.Contract/
│   ├── User.cs
│   └── Wishlist.cs
├── Birthday.Wishlist.Model/
│   ├── User.cs
│   └── Wishlist.cs
└── ...
```

## Tips for Best Results

1. **Be Explicit**: Always mention the instruction files explicitly in your prompt
2. **Use @workspace**: This gives Copilot full context of the template structure
3. **Specify Schema Path**: Provide the exact path to your JSON schema file
4. **Name the Entities**: Mention which entities you expect (helps Copilot validate)
5. **Request Step-by-Step**: Ask Copilot to follow the steps in copilot-schema-generator.md
6. **Emphasize "Exact Copy"**: Remind Copilot not to optimize or refactor

## Common Issues and Solutions

### Issue: Copilot tries to optimize the code
**Solution**: Add to prompt: "Do not refactor or optimize. Copy the Template.* patterns exactly."

### Issue: Wrong namespace prefix used
**Solution**: Clearly state: "Replace 'Template.' prefix with '[YourName].' in all namespaces"

### Issue: Missing registrations
**Solution**: Add to prompt: "Ensure all entities are registered in ServiceCollectionExtensions.cs files"

### Issue: Different patterns used
**Solution**: Reference specific files: "Follow the exact pattern from Template.Api/Extensions/EndpointMappers/StatusMapper.cs"

## Workflow

1. Create your JSON schema file in `schemas/` folder
2. Open GitHub Copilot Chat in VS Code
3. Use the prompt template above with your specifics
4. Review the generated code
5. Build and test the new solution
