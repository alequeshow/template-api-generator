# How to Use This Template Generator

## Prompt Template

Use this prompt with GitHub Copilot:

```
Generate a new solution from JSON schema file located at [PATH_TO_SCHEMA_FILE].

Solution name: [SOLUTION_NAME] (e.g., "Birthday.Wishlist")

Follow the exact patterns from the Template.* projects in this workspace. 

IMPORTANT: Do not output code in chat. Start creating files immediately.

Read the schema file and generate:
1. Solution and project structure
2. Copy ALL local development files (.vscode, mongo-init, docker-compose.yml, .dockerignore, .env_template, .gitignore)
3. Copy ALL authentication and user management files (User, UserAccessInfo, Security services, Value Objects)
4. Model classes for each schema
5. Contract DTOs for each schema  
6. Repository registrations
7. Query and Command handlers
8. API endpoint mappers
9. Update all service registrations

Place the new solution in a folder named [SOLUTION_NAME] in the repository root.

Reference:
- .github/copilot-instructions.md for generation rules
- .github/copilot-schema-generator.md for step-by-step process

Work silently. Create all files first, then provide a brief summary.
```

## Example Usage

```
Generate a new solution from JSON schema file located at schemas/birthday-wishlist.json.

Solution name: Birthday.Wishlist

Follow the exact patterns from the Template.* projects in this workspace.

IMPORTANT: Do not output code in chat. Start creating files immediately.

Read the schema file and generate:
1. Solution and project structure
2. Copy ALL local development files (.vscode, mongo-init, docker-compose.yml, .dockerignore, .env_template, .gitignore)
3. Copy ALL authentication and user management files (User, UserAccessInfo, Security services, Value Objects)
4. Model classes for each schema (User, Wishlist)
5. Contract DTOs for each schema
6. Repository registrations (including User and UserAccessInfo)
7. Query and Command handlers for User and Wishlist
8. API endpoint mappers (Authentication, User, Wishlist)
9. Update all service registrations with authentication services
10. Update project names in docker-compose.yml, .vscode files, and mongo-init scripts

Place the new solution in a folder named Birthday.Wishlist in the repository root.

Reference the generation instructions in .github/copilot-instructions.md and .github/copilot-schema-generator.md.

Work silently. Create all files first, then provide a brief summary at the end.

CRITICAL: 
- Do not preview code in chat before creating files
- Include the complete authentication system from Template.* (all files marked "ALWAYS COPY")
- Include ALL local development files for Docker and VS Code debugging
```

## Example with @workspace mention

```
@workspace Generate a new solution from JSON schema file at schemas/my-schema.json with solution name "MyProject.Name". 

IMPORTANT: Do not output code in chat. Start creating files immediately.

Follow .github/copilot-instructions.md and .github/copilot-schema-generator.md exactly. Do not refactor or optimize, just copy the Template.* patterns.

Work silently. Create all files, then summarize at the end.
```

## Expected Output Structure

```
Birthday.Wishlist/
├── Birthday.Wishlist.sln
├── .vscode/                          (ALWAYS INCLUDE)
│   ├── launch.json                   (update project paths)
│   ├── tasks.json                    (update project paths)
│   └── extensions.json
├── mongo-init/                       (ALWAYS INCLUDE)
│   └── 01-init.js                    (update database name)
├── .dockerignore                     (ALWAYS INCLUDE)
├── .env_template                     (ALWAYS INCLUDE, update db name)
├── .gitignore                        (ALWAYS INCLUDE)
├── docker-compose.yml                (ALWAYS INCLUDE, update service names)
├── Birthday.Wishlist.Api/
│   ├── Extensions/
│   │   └── EndpointMappers/
│   │       ├── AuthenticationMapper.cs (ALWAYS INCLUDE)
│   │       ├── UserMapper.cs (ALWAYS INCLUDE)
│   │       └── WishlistMapper.cs
│   └── ...
├── Birthday.Wishlist.Application/
│   ├── Handlers/
│   │   ├── UserQueryHandler.cs (ALWAYS INCLUDE)
│   │   ├── UserCommandHandler.cs (ALWAYS INCLUDE)
│   │   ├── WishlistQueryHandler.cs
│   │   └── WishlistCommandHandler.cs
│   ├── Security/
│   │   ├── IAuthenticationService.cs (ALWAYS INCLUDE)
│   │   ├── IPasswordHasher.cs (ALWAYS INCLUDE)
│   │   ├── ITokenService.cs (ALWAYS INCLUDE)
│   │   ├── IUserRegistrationService.cs (ALWAYS INCLUDE)
│   │   ├── AuthenticationService.cs (ALWAYS INCLUDE)
│   │   ├── PasswordHasher.cs (ALWAYS INCLUDE)
│   │   ├── TokenService.cs (ALWAYS INCLUDE)
│   │   └── UserRegistrationService.cs (ALWAYS INCLUDE)
│   └── ...
├── Birthday.Wishlist.Contract/
│   ├── User.cs (ALWAYS INCLUDE)
│   ├── Wishlist.cs
│   └── Authentication/
│       ├── AuthenticationResult.cs (ALWAYS INCLUDE)
│       ├── RefreshTokenRequest.cs (ALWAYS INCLUDE)
│       ├── UserCredentialsRequest.cs (ALWAYS INCLUDE)
│       ├── UserRegistrationRequest.cs (ALWAYS INCLUDE)
│       ├── UserRegistrationResult.cs (ALWAYS INCLUDE)
│       └── UserRegistrationStatus.cs (ALWAYS INCLUDE)
├── Birthday.Wishlist.Model/
│   ├── User.cs (ALWAYS INCLUDE)
│   ├── UserAccessInfo.cs (ALWAYS INCLUDE)
│   ├── Wishlist.cs
│   └── ValueObjects/
│       ├── PersonName.cs (ALWAYS INCLUDE)
│       ├── Email.cs (ALWAYS INCLUDE)
│       ├── UserIdentifier.cs (ALWAYS INCLUDE)
│       └── ActiveInfo.cs (ALWAYS INCLUDE)
└── ...
```

## Tips for Best Results

1. **Be Explicit**: Always mention the instruction files explicitly in your prompt
2. **Use @workspace**: This gives Copilot full context of the template structure
3. **Specify Schema Path**: Provide the exact path to your JSON schema file
4. **Name the Entities**: Mention which entities you expect (helps Copilot validate)
5. **Request Step-by-Step**: Ask Copilot to follow the steps in copilot-schema-generator.md
6. **Emphasize "Exact Copy"**: Remind Copilot not to optimize or refactor
7. **🔥 MOST IMPORTANT**: Add "Do not output code in chat. Start creating files immediately." at the beginning of your prompt

## Common Issues and Solutions

### Issue: Output limit reached before file creation
**Solution**: Add to prompt at the very beginning: "IMPORTANT: Do not output code in chat. Start creating files immediately. Work silently."

### Issue: Copilot tries to optimize the code
**Solution**: Add to prompt: "Do not refactor or optimize. Copy the Template.* patterns exactly."

### Issue: Wrong namespace prefix used
**Solution**: Clearly state: "Replace 'Template.' prefix with '[YourName].' in all namespaces"

### Issue: Missing registrations
**Solution**: Add to prompt: "Ensure all entities are registered in ServiceCollectionExtensions.cs files, including User, UserAccessInfo, and all authentication services"

### Issue: Authentication system not included
**Solution**: Emphasize: "Copy ALL files marked 'ALWAYS COPY' from Template.*, including complete authentication system"

### Issue: Value Objects missing
**Solution**: Add to prompt: "Copy all Value Objects from Template.Model/ValueObjects (PersonName, Email, UserIdentifier, ActiveInfo)"

### Issue: Local development files not copied
**Solution**: Emphasize: "Copy ALL local development files (.vscode, mongo-init, docker-compose.yml, .dockerignore, .env_template, .gitignore)"

### Issue: Docker or VS Code debugging not working
**Solution**: Verify project names were updated in docker-compose.yml, launch.json, tasks.json, and mongo-init/01-init.js

### Issue: Different patterns used
**Solution**: Reference specific files: "Follow the exact pattern from Template.Api/Extensions/EndpointMappers/StatusMapper.cs"

## Workflow

1. Create your JSON schema file in `schemas/` folder
2. Open GitHub Copilot Chat in VS Code
3. Use the prompt template above with your specifics
4. Review the generated code, especially:
   - Verify User and UserAccessInfo entities are present
   - Verify all authentication services are registered
   - Verify AuthenticationMapper and UserMapper are mapped
   - Verify Value Objects are copied
   - Verify local development files are copied (.vscode, mongo-init, docker-compose.yml)
   - Verify project names updated in docker-compose.yml and .vscode files
   - Verify database name updated in mongo-init/01-init.js
5. Build and test the new solution
6. Run `docker-compose up` to test MongoDB and API container
7. Use VS Code debugger with F5 to verify debugging works
