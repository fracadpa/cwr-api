# Feature Plan: Change ID Data Type to Integer for Plan, Company, and Subscription Entities

## Objective

This plan outlines the steps to change the `id` data type from `string` to `number` (integer) for the `Plan`, `Company`, and `Subscription` domain entities, including all their references and dependencies across the application.

## Analysis

The project adheres to a Hexagonal Architecture, which necessitates changes across multiple layers: domain, DTOs, and infrastructure (persistence, mappers, repositories), services, and controllers. The primary impact areas identified are:

*   **Domain Entities:** The core `id` property in `src/*/domain/*.ts` files.
*   **DTOs:** The `id` property and related foreign key `id`s (e.g., `companyId`, `planId`) in `src/*/dto/*.dto.ts` files.
*   **Relational Persistence (TypeORM):** The `id` property in `src/*/infrastructure/persistence/relational/entities/*.entity.ts` files. This will require database migrations to alter column types.
*   **Document Persistence (Mongoose):** The `id` property in `src/*/infrastructure/persistence/document/entities/*.schema.ts` files, specifically how `_id` is handled for integer IDs.
*   **Mappers:** Logic in `src/*/infrastructure/persistence/*/mappers/*.ts` to convert between domain and persistence entity `id` types.
*   **Repositories:** Method signatures and implementations in `src/*/infrastructure/persistence/*.repository.ts` and `src/*/infrastructure/persistence/*/repositories/*.repository.ts`.
*   **Services and Controllers:** Parameter types and internal logic handling `id`s in `src/*.service.ts` and `src/*.controller.ts`.

The change from `string` to `number` for IDs will simplify comparisons and potentially optimize database operations for relational databases.

## Plan

1.  **Update Domain Entities:**
    *   Modify `id: string;` to `id: number;` in:
        *   `src/plans/domain/plans.ts`
        *   `src/companies/domain/companies.ts`
        *   `src/subscriptions/domain/subscriptions.ts`

2.  **Update DTOs:**
    *   Modify `id: string;` to `id: number;` in:
        *   `src/plans/dto/create-plan.dto.ts`
        *   `src/plans/dto/find-all-plans.dto.ts`
        *   `src/plans/dto/plans.dto.ts`
        *   `src/plans/dto/update-plan.dto.ts`
        *   `src/companies/dto/companies.dto.ts`
        *   `src/companies/dto/create-company.dto.ts`
        *   `src/companies/dto/find-all-companies.dto.ts`
        *   `src/companies/dto/update-company.dto.ts`
        *   `src/subscriptions/dto/create-subscription.dto.ts` (also update `companyId: string;` to `companyId: number;` and `planId: string;` to `planId: number;`)
        *   `src/subscriptions/dto/find-all-subscriptions.dto.ts`
        *   `src/subscriptions/dto/subscription.dto.ts`
        *   `src/subscriptions/dto/subscriptions.dto.ts`
        *   `src/subscriptions/dto/update-subscription.dto.ts`
    *   Review and update any other `id`-related properties (e.g., `companyId`, `planId`) in these DTOs to `number`.

3.  **Update Relational Persistence (TypeORM Entities):**
    *   Modify `id: string;` to `id: number;` and ensure `@PrimaryGeneratedColumn()` (or appropriate TypeORM decorator for integer primary keys) is used in:
        *   `src/plans/infrastructure/persistence/relational/entities/plan.entity.ts`
        *   `src/companies/infrastructure/persistence/relational/entities/company.entity.ts`
        *   `src/subscriptions/infrastructure/persistence/relational/entities/subscription.entity.ts`
    *   Update foreign key relationships (e.g., `companyId`, `planId`) in relational entities to reference `number` types.

4.  **Generate and Run TypeORM Migrations:**
    *   Execute `npm run migration:generate -- src/database/migrations/ChangeIdsToIntegerForPlanCompanySubscription` to create a new migration file.
    *   Manually review and adjust the generated migration to ensure it correctly alters the `id` columns (and foreign key columns) to `INTEGER` (or equivalent database type) for the `plans`, `companies`, and `subscriptions` tables.
    *   Execute `npm run migration:run` to apply the migration to the database.

5.  **Update Document Persistence (Mongoose Schemas):**
    *   Modify `id: string;` to `id: number;` or adjust `@Prop()` decorators to explicitly define `id` as a `Number` type (if `_id` is not intended to be replaced directly with `id`) in:
        *   `src/plans/infrastructure/persistence/document/entities/plan.schema.ts`
        *   `src/companies/infrastructure/persistence/document/entities/company.schema.ts`
        *   `src/subscriptions/infrastructure/persistence/document/entities/subscription.schema.ts`
    *   Ensure any references to `_id` or `id` in these schemas correctly reflect the intended numeric type.

6.  **Update Mappers:**
    *   Adjust the mapping logic in `create`, `update`, and `toDomain` methods to handle `number` IDs in:
        *   `src/plans/infrastructure/persistence/document/mappers/plan.mapper.ts`
        *   `src/plans/infrastructure/persistence/relational/mappers/plan.mapper.ts`
        *   `src/companies/infrastructure/persistence/document/mappers/company.mapper.ts`
        *   `src/companies/infrastructure/persistence/relational/mappers/company.mapper.ts`
        *   `src/subscriptions/infrastructure/persistence/document/mappers/subscription.mapper.ts`
        *   `src/subscriptions/infrastructure/persistence/relational/mappers/subscription.mapper.ts`

7.  **Update Repository Ports and Adapters:**
    *   Modify method signatures and parameter types from `string` to `number` (or `Plan['id']`, `Company['id']`, `Subscription['id']` which now resolve to `number`) in:
        *   `src/plans/infrastructure/persistence/plan.repository.ts` (port)
        *   `src/plans/infrastructure/persistence/document/repositories/plan.repository.ts` (adapter)
        *   `src/plans/infrastructure/persistence/relational/repositories/plan.repository.ts` (adapter)
        *   `src/companies/infrastructure/persistence/company.repository.ts` (port)
        *   `src/companies/infrastructure/persistence/document/repositories/company.repository.ts` (adapter)
        *   `src/companies/infrastructure/persistence/relational/repositories/company.repository.ts` (adapter)
        *   `src/subscriptions/infrastructure/persistence/subscription.repository.ts` (port)
        *   `src/subscriptions/infrastructure/persistence/document/repositories/subscription.repository.ts` (adapter)
        *   `src/subscriptions/infrastructure/persistence/relational/repositories/subscription.repository.ts` (adapter)
    *   Ensure `_id` usage in Mongoose repositories is adjusted if `id` is directly mapped to it and `id` is now a number.

8.  **Update Services and Controllers:**
    *   Modify method parameter types and property access related to `id` from `string` to `number` in:
        *   `src/plans/plans.service.ts`
        *   `src/plans/plans.controller.ts` (especially `@Param('id') id: string` should become `@Param('id') id: number`)
        *   `src/companies/companies.service.ts`
        *   `src/companies/companies.controller.ts`
        *   `src/subscriptions/subscriptions.service.ts`
        *   `src/subscriptions/subscriptions.controller.ts`

9.  **Review and Refactor:**
    *   Run `npm run lint` and `npm run build` to catch any remaining type errors or build issues.
    *   Execute unit tests (`npm run test`) and e2e tests (`npm run test:e2e`) to ensure functionality is preserved. Specifically, update tests that use `string` IDs for these entities.
    *   Perform a project-wide search for usages of `.toString()` on `id` properties within the affected modules and remove/refactor where it's no longer necessary for number IDs.

10. **Present for Approval:** Present this plan to the user for review and approval.