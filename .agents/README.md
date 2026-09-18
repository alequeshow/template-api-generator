# Repository Agent Guide & Catalog

Welcome to the `.agents` knowledge and capabilities center for the **Template API Generator**. This folder centralizes all AI-agnostic instructions, architecture documentation, and operational skills.

---

## Directory Index

| Document / Skill | Path | Description |
|---|---|---|
| **Project Structure & Architecture** | [`project-structure.md`](./project-structure.md) | Comprehensive overview of the repository's purpose, clean/layered architecture, and detailed breakdown of each application/library in `src/`. |
| **Project Generation Skill** | [`skills/generate-project/SKILL.md`](./skills/generate-project/SKILL.md) | Skill for scaffolding a new domain solution based on the template, handling local development files, solution files, namespace substitutions, and solution orchestration. |
| **Schema Mapper Skill** | [`skills/schema-mapper/SKILL.md`](./skills/schema-mapper/SKILL.md) | Skill defining the exact layer-by-layer translation rules and code templates for turning a JSON schema into Model, Contract, Handlers, API endpoints, and UI components. |
| **MonsterAdmin Compliance Skill** | [`skills/monsteradmin-compliance/SKILL.md`](./skills/monsteradmin-compliance/SKILL.md) | Skill for implementing and reviewing UI components in `Template.Frontend.React` to ensure visual and behavioral parity with MonsterAdmin templates. |

---

## Guide for AI Assistants

### 1. When asked about repository architecture or project responsibilities:
- Consult [`project-structure.md`](./project-structure.md). It outlines project dependencies, CQRS setup, MongoDB persistence, and the built-in authentication/security system.

### 2. When asked to scaffold or generate a new solution from a JSON schema:
- Follow [`skills/generate-project/SKILL.md`](./skills/generate-project/SKILL.md).
- Use [`skills/schema-mapper/SKILL.md`](./skills/schema-mapper/SKILL.md) for generating the entity-specific code across all layers.
- Work silently on the file system; create files directly without chat output saturation.

### 3. When asked to create or map new entities from a JSON schema into an existing solution:
- Follow [`skills/schema-mapper/SKILL.md`](./skills/schema-mapper/SKILL.md) directly for type conversions, CQRS handlers, API endpoints, and DI registrations.

### 4. When asked to modify or review the React frontend:
- Follow [`skills/monsteradmin-compliance/SKILL.md`](./skills/monsteradmin-compliance/SKILL.md).
