# Template Generator — Usage Guide

## How to Run

The generator is a Copilot prompt file. Invoke it in any of these ways:

**VS Code Chat (recommended)**
Type `/generate-solution` in Copilot Chat, then provide arguments:
```
/generate-solution sample-schemas/wishlist.json Birthday.Wishlist
```

**Chat with explicit prompt reference**
```
/generate-solution schemas/my-schema.json MyProject.Name
```

**Fallback — plain chat**
```
@workspace Run .github/prompts/generate-solution.prompt.md with args: schemas/my-schema.json MyProject.Name
```

The prompt file at [.github/prompts/generate-solution.prompt.md](./prompts/generate-solution.prompt.md) contains all generation rules. It references [copilot-instructions.md](./copilot-instructions.md) and [copilot-schema-generator.md](./copilot-schema-generator.md) at runtime.

## Workflow

1. Place your JSON schema in `sample-schemas/`
2. Run `/generate-solution <schema-path> <SolutionName>` in Copilot Chat
3. Wait — the agent creates all files silently, then summarizes
4. Review the summary checklist output
5. Run `docker-compose up` to start MongoDB and the API
6. Press F5 in VS Code to start debugging

## Expected Output Structure

```
Birthday.Wishlist/
├── Birthday.Wishlist.sln
├── .vscode/                                      (ALWAYS INCLUDE)
│   ├── launch.json                               (update project paths)
│   ├── tasks.json                                (update project paths)
│   └── extensions.json
├── mongo-init/                                   (ALWAYS INCLUDE)
│   └── 01-init.js                                (update database name)
├── .dockerignore                                 (ALWAYS INCLUDE)
├── .env_template                                 (ALWAYS INCLUDE, update db name)
├── .gitignore                                    (ALWAYS INCLUDE)
├── docker-compose.yml                            (ALWAYS INCLUDE, update service names)
├── Birthday.Wishlist.Api/
│   └── Extensions/EndpointMappers/
│       ├── AuthenticationMapper.cs               (ALWAYS INCLUDE)
│       ├── UserMapper.cs                         (ALWAYS INCLUDE)
│       └── WishlistMapper.cs
├── Birthday.Wishlist.Application/
│   ├── Handlers/
│   │   ├── UserQueryHandler.cs                   (ALWAYS INCLUDE)
│   │   ├── UserCommandHandler.cs                 (ALWAYS INCLUDE)
│   │   ├── WishlistQueryHandler.cs
│   │   └── WishlistCommandHandler.cs
│   └── Interfaces/Security/
│       ├── IAuthenticationService.cs             (ALWAYS INCLUDE)
│       └── IUserRegistrationService.cs           (ALWAYS INCLUDE)
├── Birthday.Wishlist.Contract/
│   ├── User.cs                                   (ALWAYS INCLUDE)
│   ├── Wishlist.cs
│   └── Authentication/                           (ALWAYS INCLUDE all files)
├── Birthday.Wishlist.Model/
│   ├── User.cs                                   (ALWAYS INCLUDE)
│   ├── UserAccessInfo.cs                         (ALWAYS INCLUDE)
│   ├── Wishlist.cs
│   └── ValueObjects/                             (ALWAYS INCLUDE all files)
│       ├── PersonName.cs
│       ├── Email.cs
│       ├── UserIdentifier.cs
│       └── ActiveInfo.cs
├── Birthday.Wishlist.Repository/
├── Birthday.Wishlist.DatabaseFactory/
├── Birthday.Wishlist.Infrastructure/
├── Birthday.Wishlist.Security/                   (ALWAYS INCLUDE — copy from Template.Security)
│   ├── PasswordHasher.cs
│   ├── TokenService.cs
│   ├── TokenResult.cs
│   ├── Interfaces/
│   │   ├── IPasswordHasher.cs
│   │   └── ITokenService.cs
│   └── Extensions/ServiceCollectionExtensions.cs
├── Birthday.Wishlist.Frontend/                   (ALWAYS INCLUDE — copy from Template.Frontend)
│   ├── Components/
│   │   ├── Layout/                               (ALWAYS INCLUDE)
│   │   ├── Account/                              (ALWAYS INCLUDE)
│   │   ├── Shared/AlertMessage.razor             (ALWAYS INCLUDE)
│   │   └── Pages/
│   │       ├── Home.razor
│   │       └── Wishlist/                         (generated — replaces Status/)
│   │           ├── WishlistList.razor
│   │           ├── WishlistCreate.razor
│   │           ├── WishlistEdit.razor
│   │           └── WishlistDelete.razor
│   ├── Services/
│   │   ├── Authentication/                       (ALWAYS INCLUDE all files)
│   │   └── Interfaces/ApiClients/
│   │       ├── IAuthenticationApiClient.cs       (ALWAYS INCLUDE)
│   │       └── IWishlistApiClient.cs             (generated — replaces IStatusApiClient)
│   └── Extensions/ServiceCollectionExtensions.cs
└── Birthday.Wishlist.Frontend.Client/            (ALWAYS INCLUDE — copy from Template.Frontend.Client)
    ├── RedirectToLogin.razor
    └── Pages/Auth.razor
```

## Common Issues

| Issue | Fix |
|-------|-----|
| Output overflow before file creation | The prompt file enforces silent mode — if using plain chat, prepend "Do not output code in chat. Work silently." |
| Copilot optimizes code | Add: "Do not refactor. Copy Template.* patterns exactly." |
| Wrong namespace | Verify all `Template.` occurrences were replaced with `{SolutionName}.` |
| Missing registrations | Check all `ServiceCollectionExtensions.cs` files include User, UserAccessInfo, and all entity handlers |
| Status pages not replaced | Confirm `Components/Pages/Status/` was not copied — entity pages go in `Components/Pages/{Entity}/` |
| IStatusApiClient not replaced | Confirm `IStatusApiClient.cs` was not copied — each entity gets its own `I{Entity}ApiClient.cs` |
