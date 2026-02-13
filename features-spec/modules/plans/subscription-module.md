### Analysis

The design document outlines a robust multi-tenant subscription system. The architecture correctly separates concerns by introducing `Company`, `Tenant`, and `Subscription` entities, with a clear hierarchy that designates the `Company` as the billable entity and the `Tenant` as the data-isolated workspace. The denormalized `activeSubscription` reference on `Company` and `User` is a good performance consideration, though it introduces complexity that the service layer must manage carefully.

My implementation strategy will be to build the system from the database layer upwards. This bottom-up approach ensures that each new layer of business logic is built on a solid and correct data structure. I will leverage the project's existing scaffolding tools (`hygen`) to ensure consistency with the established hexagonal architecture. The most critical part of the implementation will be modifying the user signup flow, as it touches authentication and the creation of all new core entities. This will require careful, transaction-based logic to ensure atomicity.

### Plan

1.  **Scaffold New Modules**:
    *   Use the `npm run generate:all-db-resource` command to scaffold the file structure for the following new modules: `companies`, `tenants`, `plans`, and `subscriptions`.

2.  **Define Core Entities**:
    *   Modify `src/users/infrastructure/persistence/relational/entities/user.entity.ts` to add the `ManyToOne` relationship to `TenantEntity` and the `activeSubscription` relationship.
    *   Implement `src/companies/infrastructure/persistence/relational/entities/company.entity.ts` as specified in the design, defining its relationships to `TenantEntity` and `SubscriptionEntity`.
    *   Implement `src/tenants/infrastructure/persistence/relational/entities/tenant.entity.ts`, defining its relationships.
    *   Implement `src/subscriptions/infrastructure/persistence/relational/entities/subscription.entity.ts`, including the `status` enum and its relationship to `CompanyEntity`.
    *   Implement `src/plans/infrastructure/persistence/relational/entities/plan.entity.ts`.

3.  **Database Migration**:
    *   Generate a new database migration by running `npm run migration:generate -- src/database/migrations/CreateMultiTenantSubscriptionSchema`.
    *   Carefully review the generated migration file to ensure it correctly reflects the entity designs.
    *   Apply the migration to the local database with `npm run migration:run`.

4.  **Implement Service and Business Logic**:
    *   In `src/subscriptions/subscriptions.service.ts`, create methods for creating and updating subscriptions. This is where the critical business logic to enforce "only one active subscription per company" will be implemented.
    *   Implement the basic service layers for `CompaniesService`, `TenantsService`, and `PlansService`.

5.  **Integrate into User Signup and Authentication**:
    *   Modify the `register` or `create` method within `src/auth/auth.service.ts`. This method must be wrapped in a transaction and perform the following sequence:
        1.  Create `Company`.
        2.  Create `Subscription` for the company.
        3.  Update the `Company` with the `activeSubscription` reference.
        4.  Create `Tenant` linked to the company.
        5.  Create the `User`, linking them to the `Tenant` and setting their `activeSubscription` reference.
    *   Update the JWT payload in `src/auth/auth.service.ts` and the `validate` method in `src/auth/strategies/jwt.strategy.ts` to include `tenantId` and `companyId`.

6.  **Expose API Endpoints**:
    *   In `src/subscriptions/subscriptions.controller.ts`, create a protected endpoint for a company administrator to view their subscription history.
    *   In `src/plans/plans.controller.ts`, create a public endpoint to list available subscription plans.

7.  **Testing**:
    *   Write unit tests for the new service methods, especially the subscription activation logic.
    *   Update the `auth.e2e-spec.ts` to validate the new, more complex signup flow and ensure the JWT payload is correct.
    *   Create a new `subscriptions.e2e-spec.ts` to test the new subscription management endpoints.

8.  **Create Plan Document**:
    *   Create the file `features-spec/modules/plans/subscription-module.md` with the content of this plan.

9.  **Present for Approval**:
    *   Submit this implementation plan for final review and approval.
