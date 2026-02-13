# NestJS Multi-Tenant SaaS Boilerplate - AI Coding Instructions

## Architecture Overview

This is a **Hexagonal Architecture** (Ports & Adapters) NestJS API using **PostgreSQL with TypeORM** as the primary database. The architecture separates business logic (domain) from infrastructure through ports and adapters. MongoDB/Mongoose support is available as an alternative, demonstrating the architecture's database-agnostic design.

### Multi-Tenant SaaS Structure
- **Company** → has many **Tenants** → has many **Users**
- **Company** → has one active **Subscription** → references a **Plan**
- JWT tokens include: `companyId`, `tenantId`, `activeSubscriptionId` for context isolation
- Registration flow (see `auth.service.ts:243-327`) creates Company → Subscription → Tenant → User in a **transaction**

## Module Structure Pattern

Every feature module follows this structure:
```
src/{module}/
├── domain/{entity}.ts              # Pure domain entity (no DB deps)
├── dto/                            # API DTOs with Swagger decorators
├── infrastructure/persistence/
│   ├── {entity}.repository.ts      # Port (abstract interface)
│   ├── relational/                 # TypeORM adapter
│   │   ├── entities/{entity}.entity.ts
│   │   ├── mappers/{entity}.mapper.ts
│   │   └── repositories/{entity}.repository.ts
│   └── document/                   # Mongoose adapter
│       ├── entities/{entity}.schema.ts
│       ├── mappers/{entity}.mapper.ts
│       └── repositories/{entity}.repository.ts
├── {module}.controller.ts
├── {module}.service.ts
└── {module}.module.ts
```

**Key Principle**: Services use domain entities. Repositories use mappers to convert between domain ↔ persistence entities.

## Critical Development Patterns

### 1. Repository Methods
❌ **Avoid**: Generic `find(condition)` methods  
✅ **Use**: Specific methods like `findByEmail()`, `findByCompanyId()`, `findActiveSubscriptionByCompanyId()`

### 2. Transaction Management
Use `EntityManager` (not QueryRunner) for transactional operations:
```typescript
await this.dataSource.transaction(async (manager) => {
  await this.usersService.create(data, manager);
  await this.companiesService.update(id, data, manager);
});
```
All repository methods accept optional `manager?: EntityManager` parameter.

### 3. JWT Strategy
**Do NOT** validate user existence in `jwt.strategy.ts` - it defeats JWT benefits. Get full user data in services when needed.

### 4. Authentication Flow
- Login: Returns `{ token, refreshToken, tokenExpires, user }`
- Refresh: Send `refreshToken` to `POST /api/v1/auth/refresh` when `token` expires
- Tokens include multi-tenant context: `companyId`, `tenantId`, `activeSubscriptionId`

## Database Workflows (PostgreSQL + TypeORM)

### Migrations
```bash
# Generate migration after creating/modifying entity files
npm run migration:generate -- src/database/migrations/MigrationName
npm run migration:run
npm run migration:revert        # Rollback last migration
npm run schema:drop             # Drop all tables (use with caution)
```

### Seeding
```bash
npm run seed:run:relational
npm run seed:create:relational -- --name Post  # Create new seed
```

### Code Generation (Hygen)
```bash
# Generate full CRUD resource for both databases
npm run generate:resource:all-db -- --name ResourceName

# Generate for PostgreSQL only
npm run generate:resource:relational -- --name ResourceName

# Add property to existing resource
npm run add:property:to-all-db
npm run add:property:to-relational
```

> **Note**: MongoDB/Mongoose commands exist (`seed:run:document`, `generate:resource:document`) but PostgreSQL is the primary database.

## Testing

```bash
npm run test                              # Unit tests
npm run test:e2e                          # E2E tests
npm run test:e2e:relational:docker        # E2E in Docker (PostgreSQL)
npm run test:e2e:document:docker          # E2E in Docker (MongoDB)
```

## Development Setup (PostgreSQL)

1. Copy `env-example-relational` to `.env`
2. For local dev: Change `DATABASE_HOST=postgres` → `DATABASE_HOST=localhost` and `MAIL_HOST=maildev` → `MAIL_HOST=localhost`
3. Start infrastructure: `docker compose up -d postgres adminer maildev`
4. Install dependencies: `npm install`
5. Run migrations: `npm run migration:run`
6. Seed database: `npm run seed:run:relational`
7. Start dev server: `npm run start:dev`

**Important URLs**:
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Adminer (PostgreSQL client): http://localhost:8080
- Maildev: http://localhost:1080

## Serialization & Security

- Use `@Exclude({ toPlainOnly: true })` to hide sensitive fields (e.g., `password`)
- Use `@Expose({ groups: ['admin'] })` + `@SerializeOptions({ groups: ['admin'] })` for admin-only fields
- Passwords are hashed with `bcryptjs` before storage (see `user.subscriber.ts`)

## Key Files to Reference

- **Architecture docs**: `gemini.md`, `docs/architecture.md`
- **Multi-tenant auth**: `src/auth/auth.service.ts` (lines 243-327 for registration)
- **Repository pattern**: `src/users/infrastructure/persistence/relational/repositories/user.repository.ts`
- **Domain entity**: `src/users/domain/user.ts`
- **Transaction example**: `src/auth/auth.service.ts:244` (register method)
- **Mapper pattern**: `src/users/infrastructure/persistence/relational/mappers/user.mapper.ts`

## Agent Constraints

1. **Always ask for approval** before creating/modifying/deleting files
2. **Never hardcode secrets** - use environment variables
3. **Plan before implementing** - outline changes first
4. **Never ignore failing unit tests** - fix them
5. **Stick to task scope** - no unrelated refactoring

## i18n Support

- Translations in `src/i18n/{lang}/` folders
- Use header `x-custom-lang: en` for language selection
- Access in code: `I18nContext.current().t('common.confirmEmail')`
