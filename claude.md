# CLAUDE.md - Claude Code Agent Instructions

> **Purpose**: This file provides Claude Code with project-specific context, conventions, and constraints for this NestJS application.

---

## Quick Reference

```
Tech Stack: NestJS, TypeScript, TypeORM (PostgreSQL) OR Mongoose (MongoDB)
Architecture: Hexagonal (Ports & Adapters)
Auth: JWT with refresh tokens
API Version: /api/v1/*
```

---

## Project Architecture

This project uses **Hexagonal Architecture** (Ports & Adapters) to separate business logic from infrastructure.

### Module Structure

```
src/<module>/
├── domain/
│   └── <entity>.ts              # Domain entity (pure business logic, no DB deps)
├── dto/
│   ├── create-<entity>.dto.ts
│   ├── update-<entity>.dto.ts
│   └── find-all-<entity>.dto.ts
├── infrastructure/
│   └── persistence/
│       ├── <entity>.repository.ts           # PORT (interface)
│       ├── relational/                      # PostgreSQL adapter
│       │   ├── entities/<entity>.entity.ts  # TypeORM entity
│       │   ├── mappers/<entity>.mapper.ts
│       │   ├── repositories/<entity>.repository.ts  # ADAPTER
│       │   └── relational-persistence.module.ts
│       └── document/                        # MongoDB adapter
│           ├── entities/<entity>.schema.ts  # Mongoose schema
│           ├── mappers/<entity>.mapper.ts
│           ├── repositories/<entity>.repository.ts  # ADAPTER
│           └── document-persistence.module.ts
├── <module>.controller.ts
├── <module>.service.ts
└── <module>.module.ts
```

### Key Concepts

| Component | Location | Purpose |
|-----------|----------|---------|
| Domain Entity | `domain/<entity>.ts` | Business logic, no infrastructure dependencies |
| Port | `infrastructure/persistence/<entity>.repository.ts` | Interface defining repository contract |
| Adapter | `infrastructure/persistence/relational/repositories/` | Implementation of port for specific DB |
| Mapper | `infrastructure/persistence/*/mappers/` | Converts DB entity ↔ Domain entity |
| DB Entity | `infrastructure/persistence/*/entities/` | Database schema/structure |

---

## Code Patterns & Conventions

### Repository Pattern (REQUIRED)

**DO**: Create single-responsibility methods

```typescript
// ✅ CORRECT
export class UsersRelationalRepository implements UserRepository {
  async findByEmail(email: string): Promise<User> { /* ... */ }
  async findByRoles(roles: string[]): Promise<User[]> { /* ... */ }
  async findByIds(ids: string[]): Promise<User[]> { /* ... */ }
}
```

**DON'T**: Create universal/generic methods

```typescript
// ❌ WRONG - Avoid universal conditions
export class UsersRelationalRepository implements UserRepository {
  async find(condition: UniversalConditionInterface): Promise<User> { /* ... */ }
}
```

### Serialization

Hide sensitive properties:
```typescript
import { Exclude } from 'class-transformer';

@Column({ nullable: true })
@Exclude({ toPlainOnly: true })
password: string;
```

Expose properties for specific roles:
```typescript
import { Expose } from 'class-transformer';

@Column({ unique: true, nullable: true })
@Expose({ groups: ['admin'] })
email: string | null;
```

Controller with serialization groups:
```typescript
@SerializeOptions({ groups: ['admin'] })
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne({ id: +id });
}
```

### i18n Translations

```typescript
import { I18nContext } from 'nestjs-i18n';

const i18n = I18nContext.current();
if (!i18n) throw new Error('I18nContext is not available');
const text = await i18n.t('common.confirmEmail');
```

---

## Database Commands

### TypeORM (PostgreSQL)

| Action | Command |
|--------|---------|
| Generate migration | `npm run migration:generate -- src/database/migrations/<MigrationName>` |
| Run migrations | `npm run migration:run` |
| Revert migration | `npm run migration:revert` |
| Drop all tables | `npm run schema:drop` |
| Create seed | `npm run seed:create:relational -- --name <EntityName>` |
| Run seeds | `npm run seed:run:relational` |

### Mongoose (MongoDB)

| Action | Command |
|--------|---------|
| Create seed | `npm run seed:create:document -- --name <EntityName>` |
| Run seeds | `npm run seed:run:document` |

---

## Testing Commands

| Type | Command |
|------|---------|
| Unit tests | `npm run test` |
| E2E tests | `npm run test:e2e` |
| E2E (PostgreSQL, Docker) | `npm run test:e2e:relational:docker` |
| E2E (MongoDB, Docker) | `npm run test:e2e:document:docker` |

---

## Authentication

### JWT Strategy

The JWT strategy in `src/auth/strategies/jwt.strategy.ts` validates tokens **without** database lookup for performance:

```typescript
public validate(payload) {
  if (!payload.id) throw new UnauthorizedException();
  return payload;  // Returns payload directly, no DB call
}
```

> **Note**: Fetch full user data in services when needed, not in JWT validation.

### Auth Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/auth/email/login` | Login → returns `token`, `tokenExpires`, `refreshToken` |
| `POST /api/v1/auth/refresh` | Refresh token (send `refreshToken` in Authorization header) |
| `POST /api/v1/auth/logout` | Logout (then clear tokens on client) |

---

## Performance Notes

### PostgreSQL
- Create indexes on Foreign Key columns manually (PostgreSQL doesn't auto-create them)
- Configure `DATABASE_MAX_CONNECTIONS` in `.env` (default: 100)

### MongoDB
- Follow [MongoDB Schema Design Best Practices](https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/)
- Avoid [Schema Design Anti-Patterns](https://www.mongodb.com/developer/products/mongodb/schema-design-anti-pattern-massive-arrays)

---

## Agent Rules

### ⚠️ MANDATORY: Plan-First Workflow

**STOP! Before ANY code modification, you MUST:**

1. **Present a detailed plan** including:
   - Files to be created/modified/deleted
   - Function signatures and interfaces
   - Dependencies affected
   - Migration requirements (if any)
2. **Wait for explicit approval** before proceeding
3. **Do NOT write any code** until the plan is approved

```
❌ WRONG: Start coding immediately
✅ CORRECT: Present plan → Get approval → Implement
```

### ✅ MANDATORY: Post-Change Verification

**After EVERY modification, you MUST:**

1. **Build the project**: `npm run build`
   - If build fails → Fix errors before continuing
   - Do NOT proceed with failing build
2. **Run tests**: `npm run test`
   - If tests fail → Fix failing tests before continuing
   - Do NOT ignore or skip failing tests
3. **Report results** to user

```bash
# Required verification sequence after changes:
npm run build    # Must pass
npm run test     # Must pass
```

### 🔒 Security

- **NEVER** hardcode API keys, tokens, or secrets
- **ALWAYS** use environment variables: `process.env.VARIABLE_NAME`
- **NEVER** prompt for user input unless explicitly instructed

### 📝 File Modifications

- **ASK** before creating, modifying, or deleting files
- **PREPARE** a descriptive Git commit message when work is complete
- **SUMMARIZE** all changes made

### 📋 Planning

- **PLAN FIRST**: Generate a multi-step implementation plan before coding
- **STAY FOCUSED**: Do not refactor or add features outside the current task scope
- **NO SCOPE CREEP**: Only implement what was explicitly requested and approved

### 🧪 Testing

- **NEVER** modify source files when writing unit tests
- **NEVER** ignore failing tests
- **ALWAYS** run full test suite after changes
- **FIX** any tests broken by your changes before considering task complete

---

## Creating New Features Checklist

When creating a new module/feature, follow this order:

### Phase 1: Planning (REQUIRED)
1. [ ] **Present implementation plan for approval**
2. [ ] **Wait for explicit user approval before proceeding**

### Phase 2: Implementation
3. [ ] Create domain entity in `domain/<entity>.ts`
4. [ ] Create DTOs in `dto/`
5. [ ] Create repository port (interface) in `infrastructure/persistence/<entity>.repository.ts`
6. [ ] Create DB entity in `infrastructure/persistence/relational/entities/` or `document/entities/`
7. [ ] Create mapper in `infrastructure/persistence/*/mappers/`
8. [ ] Create repository adapter implementing the port
9. [ ] Create persistence module
10. [ ] Create service
11. [ ] Create controller
12. [ ] Create module and wire dependencies
13. [ ] Generate migration (TypeORM) or verify schema (Mongoose)

### Phase 3: Verification (REQUIRED)
14. [ ] **Run build**: `npm run build` — must pass
15. [ ] **Run tests**: `npm run test` — must pass
16. [ ] Write new tests for the feature
17. [ ] **Run tests again**: `npm run test` — must pass
18. [ ] Prepare Git commit message summary

---

## File Templates

### Domain Entity Template

```typescript
// src/<module>/domain/<entity>.ts
export class <Entity> {
  id: number;
  // Add domain properties (no decorators, no DB dependencies)
  
  // Add domain methods/business logic here
}
```

### Repository Port Template

```typescript
// src/<module>/infrastructure/persistence/<entity>.repository.ts
import { <Entity> } from '../../domain/<entity>';

export abstract class <Entity>Repository {
  abstract create(data: Omit<<Entity>, 'id'>): Promise<<Entity>>;
  abstract findById(id: number): Promise<<Entity> | null>;
  abstract update(id: number, data: Partial<<Entity>>): Promise<<Entity>>;
  abstract delete(id: number): Promise<void>;
}
```

### TypeORM Entity Template

```typescript
// src/<module>/infrastructure/persistence/relational/entities/<entity>.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity()
export class <Entity>Entity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  // Add columns as needed
}
```

### Mongoose Schema Template

```typescript
// src/<module>/infrastructure/persistence/document/entities/<entity>.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type <Entity>SchemaDocument = HydratedDocument<<Entity>SchemaClass>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
})
export class <Entity>SchemaClass extends EntityDocumentHelper {
  @Prop()
  name: string;
  
  // Add props as needed
}

export const <Entity>Schema = SchemaFactory.createForClass(<Entity>SchemaClass);
```