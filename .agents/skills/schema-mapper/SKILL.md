---
name: schema-mapper
description: Maps JSON schema definitions into strongly-typed C# domain models, DTO contracts, CQRS handlers, API endpoint mappers, and React components/BFF routes across solution layers.
---

# Schema Mapper Skill

Use this skill to convert JSON schema definitions into clean, strongly-typed code across both the .NET backend layers and the Next.js/React frontend.

## Schema Input Structure

A JSON schema definition typically contains:
- `title`: Name of the entity in PascalCase (e.g., `Wishlist`, `Product`, `CustomerOrder`).
- `type`: Usually `"object"`.
- `properties`: Dictionary of property definitions.
- `required`: Array of property names that are mandatory.

---

## Type Mapping Reference

| JSON Schema Type / Format | C# Type | TypeScript Type | HTML Input Type | Nullability (C# / TS) | Default Assignment |
|---|---|---|---|---|---|
| `string` | `string` | `string` | `text` | `required string` / `string` (or `string?` / `string?`) | None |
| `string` (format: `email`) | `string` | `string` | `email` | `required string` / `string` (or `string?` / `string?`) | None |
| `string` (format: `date-time`) | `DateTime` | `string` | `datetime-local` | `DateTime` / `string` (or `DateTime?` / `string?`) | None |
| `string` (format: `date`) | `DateTime` | `string` | `date` | `DateTime` / `string` (or `DateTime?` / `string?`) | None |
| `number` | `decimal` | `number` | `number` (step `0.01`) | `decimal` / `number` (or `decimal?` / `number?`) | None |
| `integer` | `int` | `number` | `number` (step `1`) | `int` / `number` (or `int?` / `number?`) | None |
| `boolean` | `bool` | `boolean` | `checkbox` | `bool` / `boolean` | None |
| `array` (of primitives) | `List<T>` | `T[]` | dynamic list / tags | Non-null | `= [];` |
| `array` (of objects) | `List<NestedClass>` | `NestedType[]` | sub-form list | Non-null | `= [];` |
| `object` (nested) | `NestedClass` | `NestedType` | fieldset | `required NestedClass` (or `NestedClass?`) | None |

---

## Layer-by-Layer Generation Rules

For every entity defined in the schema (e.g. `Wishlist`):

### 1. Model Layer (`{SolutionName}.Model/{EntityName}.cs`)

- **Base Class**: Must inherit from `EntityModel`.
- **Primary Key**: Do NOT redeclare `Id`; it is inherited from `EntityModel` as `string Id`.
- **Properties**:
  - Convert property names from camelCase / snake_case to **PascalCase**.
  - Add `required` keyword to properties listed in the schema's `required` array.
  - Mark properties NOT in `required` as nullable (`?`).
  - Arrays are initialized to empty list `= [];`.
  - Nested objects become separate classes declared in the same file or adjacent files.

#### Example:
```csharp
namespace {SolutionName}.Model;

public class Wishlist : EntityModel
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public decimal TargetAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<WishlistItem> Items { get; set; } = [];
}

public class WishlistItem
{
    public required string ProductId { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
}
```

---

### 2. Contract Layer (`{SolutionName}.Contract/{EntityName}.cs`)

- **Pure POCO**: Standalone DTO; does NOT inherit from `EntityModel`.
- **Nullable Id**: Always include `public string? Id { get; set; }`. This allows the DTO to be sent in POST requests before an ID has been generated.
- **Properties**: Mirror properties from the Model, using matching C# types.
- **Nested Classes**: Define corresponding DTO classes for nested structures.

#### Example:
```csharp
namespace {SolutionName}.Contract;

public class Wishlist
{
    public string? Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public decimal TargetAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<WishlistItem> Items { get; set; } = [];
}

public class WishlistItem
{
    public required string ProductId { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
}
```

---

### 3. Repository Layer (`{SolutionName}.Repository`)

Entities are stored via the generic repository pattern backed by MongoDB. Simply register the entity in `{SolutionName}.Repository/Extensions/ServiceCollectionExtensions.cs`:

```csharp
services
    .ConfigureMongoDatabase()
    .AddMongoRepository<{EntityName}>();
```

---

### 4. Application Layer (`{SolutionName}.Application/Handlers/`)

Create two handlers for each entity:

#### Query Handler: `{EntityName}QueryHandler.cs`
Implements both `IQueryHandler<QuerySingle<{EntityName}>, {EntityName}>` and `IQueryHandler<QueryMany<{EntityName}>, List<{EntityName}>>`:

```csharp
using {SolutionName}.Application.Queries;
using {SolutionName}.Model;
using {SolutionName}.Model.Interfaces;

namespace {SolutionName}.Application.Handlers;

public class {EntityName}QueryHandler(IRepository<{EntityName}, string> repository) :
    IQueryHandler<QuerySingle<{EntityName}>, {EntityName}>,
    IQueryHandler<QueryMany<{EntityName}>, List<{EntityName}>>
{
    public async Task<{EntityName}> Handle(QuerySingle<{EntityName}> query, CancellationToken cancellationToken = default)
    {
        return await repository.GetByIdAsync(query.Id, cancellationToken);
    }

    public async Task<List<{EntityName}>> Handle(QueryMany<{EntityName}> query, CancellationToken cancellationToken = default)
    {
        return await repository.GetAllAsync(cancellationToken);
    }
}
```

#### Command Handler: `{EntityName}CommandHandler.cs`
Implements `ICommandHandler<Command<{EntityName}>, {EntityName}>`:

```csharp
using {SolutionName}.Application.Commands;
using {SolutionName}.Model;
using {SolutionName}.Model.Interfaces;

namespace {SolutionName}.Application.Handlers;

public class {EntityName}CommandHandler(IRepository<{EntityName}, string> repository) :
    ICommandHandler<Command<{EntityName}>, {EntityName}>
{
    public async Task<{EntityName}> Handle(Command<{EntityName}> command, CancellationToken cancellationToken = default)
    {
        return command.Operation switch
        {
            CommandOperation.Create => await repository.AddAsync(command.Entity, cancellationToken),
            CommandOperation.Update => await repository.UpdateAsync(command.Entity, cancellationToken),
            CommandOperation.Delete => await repository.DeleteAsync(command.Entity.Id, cancellationToken),
            _ => throw new NotSupportedException($"Operation {command.Operation} is not supported.")
        };
    }
}
```

#### Handler Registration:
In `{SolutionName}.Application/Extensions/ServiceCollectionExtensions.cs`:
```csharp
services.AddScoped<{EntityName}QueryHandler>();
services.AddScoped<{EntityName}CommandHandler>();
```

---

### 5. API Layer (`{SolutionName}.Api/Extensions/EndpointMappers/`)

Create `{EntityName}Mapper.cs` exposing 5 REST endpoints using `ApiHandler.HandleEndpointAsync`:
- Endpoint routes use lowercase singular nouns: `/{entityname}` (e.g. `/wishlist`).

```csharp
using {SolutionName}.Api.Handlers;
using {SolutionName}.Application.Commands;
using {SolutionName}.Application.Handlers;
using {SolutionName}.Application.Queries;
using {SolutionName}.Model;
using Microsoft.AspNetCore.Mvc;

namespace {SolutionName}.Api.Extensions.EndpointMappers;

public static class {EntityName}Mapper
{
    public static WebApplication Map{EntityName}Endpoint(this WebApplication app)
    {
        var group = app.MapGroup("/{entityname}")
            .WithTags("{EntityName}");

        group.MapGet("/", async ([FromServices] {EntityName}QueryHandler handler, CancellationToken ct) =>
        {
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new QueryMany<{EntityName}>(), ct));
        });

        group.MapGet("/{id}", async (string id, [FromServices] {EntityName}QueryHandler handler, CancellationToken ct) =>
        {
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new QuerySingle<{EntityName}> { Id = id }, ct));
        });

        group.MapPost("/", async ([FromBody] {EntityName} model, [FromServices] {EntityName}CommandHandler handler, CancellationToken ct) =>
        {
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new Command<{EntityName}> { Entity = model, Operation = CommandOperation.Create }, ct));
        });

        group.MapPut("/{id}", async (string id, [FromBody] {EntityName} model, [FromServices] {EntityName}CommandHandler handler, CancellationToken ct) =>
        {
            model.Id = id;
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new Command<{EntityName}> { Entity = model, Operation = CommandOperation.Update }, ct));
        });

        group.MapDelete("/{id}", async (string id, [FromServices] {EntityName}CommandHandler handler, CancellationToken ct) =>
        {
            return await ApiHandler.HandleEndpointAsync(
                async () => await handler.Handle(new Command<{EntityName}> { Entity = new {EntityName} { Id = id }, Operation = CommandOperation.Delete }, ct));
        });

        return app;
    }
}
```

#### Registration:
In `{SolutionName}.Api/Extensions/WebApplicationExtensions.cs`:
```csharp
app.Map{EntityName}Endpoint();
```

---

### 6. Frontend Layer (`Template.Frontend.React`)

When frontend generation is enabled, generate the following components inside `src/{SolutionName}.Frontend.React`:

#### Part A: BFF Server Route Handlers

1. **`app/api/bff/{entityname}/route.ts`**:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { assertCsrfToken } from "@/shared/bff/server/cookies";
import { callBackendAuthorized, toProxyResponse } from "@/shared/bff/server/proxyAuth";

export async function GET(request: NextRequest) {
  const { response, updatedTokens } = await callBackendAuthorized(request, "/{entityname}", {
    method: "GET",
  });
  return toProxyResponse(response, updatedTokens);
}

export async function POST(request: NextRequest) {
  const csrfError = assertCsrfToken(request);
  if (csrfError) {
    return NextResponse.json({ message: csrfError }, { status: 403 });
  }

  const payload = await request.text();
  const { response, updatedTokens } = await callBackendAuthorized(request, "/{entityname}", {
    method: "POST",
    body: payload,
  });
  return toProxyResponse(response, updatedTokens);
}
```

2. **`app/api/bff/{entityname}/[id]/route.ts`**:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { assertCsrfToken } from "@/shared/bff/server/cookies";
import { callBackendAuthorized, toProxyResponse } from "@/shared/bff/server/proxyAuth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const { response, updatedTokens } = await callBackendAuthorized(request, `/{entityname}/${id}`, {
    method: "GET",
  });
  return toProxyResponse(response, updatedTokens);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const csrfError = assertCsrfToken(request);
  if (csrfError) {
    return NextResponse.json({ message: csrfError }, { status: 403 });
  }

  const payload = await request.text();
  const { id } = await params;
  const { response, updatedTokens } = await callBackendAuthorized(request, `/{entityname}/${id}`, {
    method: "PUT",
    body: payload,
  });
  return toProxyResponse(response, updatedTokens);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const csrfError = assertCsrfToken(request);
  if (csrfError) {
    return NextResponse.json({ message: csrfError }, { status: 403 });
  }

  const { id } = await params;
  const { response, updatedTokens } = await callBackendAuthorized(request, `/{entityname}/${id}`, {
    method: "DELETE",
  });
  return toProxyResponse(response, updatedTokens);
}
```

3. **Register in `src/shared/bff/endpoints.ts`**:
```typescript
export const bffEndpoints = {
  // ... existing endpoints
  {entityname}: "/api/bff/{entityname}",
} as const;
```

---

#### Part B: Feature Module (`src/features/{entityname}/`)

1. **`src/features/{entityname}/types.ts`**:
```typescript
export type {EntityName}Item = {
  id?: string;
  // properties mapped from JSON schema
  title: string;
  description?: string;
  createdAt: string;
};
```

2. **`src/features/{entityname}/api.ts`**:
```typescript
import { bffEndpoints } from "@/shared/bff/endpoints";
import { readCsrfTokenFromDocument } from "@/shared/utils/csrf";
import type { {EntityName}Item } from "@/features/{entityname}/types";

async function performApiRequest(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(init?.method && init.method !== "GET" ? { "x-csrf-token": readCsrfTokenFromDocument() } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response;
}

async function apiRequestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await performApiRequest(path, init);
  return response.json() as Promise<T>;
}

async function apiRequestText(path: string, init?: RequestInit): Promise<string> {
  const response = await performApiRequest(path, init);
  return response.text();
}

async function apiRequestNoContent(path: string, init?: RequestInit): Promise<void> {
  await performApiRequest(path, init);
}

export function get{EntityName}List() {
  return apiRequestJson<{EntityName}Item[]>(bffEndpoints.{entityname}, { method: "GET" });
}

export function get{EntityName}ById(id: string) {
  return apiRequestJson<{EntityName}Item>(`${bffEndpoints.{entityname}}/${id}`, { method: "GET" });
}

export function create{EntityName}(payload: {EntityName}Item) {
  return apiRequestText(bffEndpoints.{entityname}, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function update{EntityName}(id: string, payload: {EntityName}Item) {
  return apiRequestNoContent(`${bffEndpoints.{entityname}}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ ...payload, id }),
  });
}

export function delete{EntityName}(id: string) {
  return apiRequestNoContent(`${bffEndpoints.{entityname}}/${id}`, {
    method: "DELETE",
  });
}
```

3. **`src/features/{entityname}/constants.ts`**:
```typescript
export const {ENTITY_NAME}_MODAL_TIMEOUT_MS = 2500;
```

4. **`src/features/{entityname}/hooks/use{EntityName}.ts`**:
```typescript
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  create{EntityName},
  delete{EntityName},
  get{EntityName}ById,
  get{EntityName}List,
  update{EntityName},
} from "@/features/{entityname}/api";
import type { {EntityName}Item } from "@/features/{entityname}/types";

const {entityname}ListQueryKey = ["{entityname}", "list"] as const;

export function use{EntityName}ListQuery() {
  return useQuery({
    queryKey: {entityname}ListQueryKey,
    queryFn: get{EntityName}List,
  });
}

export function use{EntityName}ByIdQuery(id?: string) {
  const normalizedId = id ?? "";
  return useQuery({
    queryKey: ["{entityname}", "item", normalizedId],
    queryFn: () => get{EntityName}ById(normalizedId),
    enabled: normalizedId.length > 0,
  });
}

export function useCreate{EntityName}Mutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {EntityName}Item) => create{EntityName}(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: {entityname}ListQueryKey });
    },
  });
}

export function useUpdate{EntityName}Mutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: {EntityName}Item }) => update{EntityName}(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: {entityname}ListQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["{entityname}", "item", variables.id] }),
      ]);
    },
  });
}

export function useDelete{EntityName}Mutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => delete{EntityName}(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: {entityname}ListQueryKey });
    },
  });
}
```

5. **`src/features/{entityname}/components/`**:
- **`{EntityName}Form.tsx`**: Controlled form with field inputs corresponding to schema properties, error state, and submit callback.
- **`{EntityName}CreateCard.tsx`**: Renders `{EntityName}Form`, calls `useCreate{EntityName}Mutation()`, displays `Modal` for success/error feedback, and navigates back to `/{entityname}` on success.
- **`{EntityName}EditCard.tsx`**: Loads item with `use{EntityName}ByIdQuery(id)`, renders `{EntityName}Form` populated with initial values, calls `useUpdate{EntityName}Mutation()`, and displays feedback modals.
- **`{EntityName}ListTable.tsx`**: Displays a responsive, paginated table using `use{EntityName}ListQuery()` with search filter, sort, delete action modal, and action links to `/{entityname}/create` and `/{entityname}/edit/{id}`.

---

#### Part C: Next.js App Router Pages (`app/{entityname}/`)

1. **`app/{entityname}/page.tsx`**:
```tsx
import { {EntityName}ListTable } from "@/features/{entityname}/components/{EntityName}ListTable";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function {EntityName}Page() {
  return (
    <AppShell>
      <PageContainer
        title="{EntityName}"
        subtitle="Manage {entityname} entries"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "{EntityName}" }]}
      >
        <{EntityName}ListTable />
      </PageContainer>
    </AppShell>
  );
}
```

2. **`app/{entityname}/create/page.tsx`**:
```tsx
import { {EntityName}CreateCard } from "@/features/{entityname}/components/{EntityName}CreateCard";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function {EntityName}CreatePage() {
  return (
    <AppShell>
      <PageContainer
        title="Create {EntityName}"
        subtitle="Create a new {entityname} entry"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "{EntityName}", href: "/{entityname}" },
          { label: "Create" },
        ]}
      >
        <{EntityName}CreateCard />
      </PageContainer>
    </AppShell>
  );
}
```

3. **`app/{entityname}/edit/[id]/page.tsx`**:
```tsx
import { {EntityName}EditCard } from "@/features/{entityname}/components/{EntityName}EditCard";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default async function {EntityName}EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <PageContainer
        title="Edit {EntityName}"
        subtitle="Update an existing {entityname} entry"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "{EntityName}", href: "/{entityname}" },
          { label: "Edit" },
        ]}
      >
        <{EntityName}EditCard id={id} />
      </PageContainer>
    </AppShell>
  );
}
```

---

#### Part D: Navigation & Security Registration

1. **`src/modules/smartadmin/navigation.ts`**:
   Add a link to the navigation bar:
   ```typescript
   { label: "{EntityName}", href: "/{entityname}" },
   ```

2. **`proxy.ts`**:
   Add the path to `protectedPrefixes` to guard it with authentication:
   ```typescript
   const protectedPrefixes = ["/auth", "/{entityname}"];
   ```

---

## Value Objects Pattern in Domain

Value Objects are used in the domain model to encapsulate and enforce invariants on primitive types.

### Domain Model vs Contract POCO
- **In `{SolutionName}.Model`**: Use C# records with initialization, validation, and domain behavior.
  - `PersonName(FirstName, LastName)`
  - `Email(Value)`: Normalizes email to lowercase.
  - `UserIdentifier(Identifier)`: Normalizes identifier to lowercase.
  - `ActiveInfo()`: Encapsulates `IsActive`, `IsActiveFrom`, `DeactivatedSince`, with `Activate()` and `Deactivate()` methods.
- **In `{SolutionName}.Contract`**: Flattened representation for JSON serialization over the wire.
  - E.g. `User.cs` in Contract exposes plain strings: `FirstName`, `LastName`, `Email`, `UserIdentifier`, and `IsActive` boolean.
