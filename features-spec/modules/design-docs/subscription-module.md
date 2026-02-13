### Summary

The goal of this document is to outline the design for a new subscription management module. This module will handle the creation of companies and tenants, management of subscription plans, and the entire subscription lifecycle. For performance, `Company` and `User` entities will include a direct reference to the currently active subscription.

### Context

The existing boilerplate application needs a robust subscription system to support multi-tenant software-as-a-service (SaaS) products. This new module will introduce a structure where a customer organization (`Company`) has a dedicated workspace (`Tenant`) and a history of subscriptions, with an easily accessible pointer to the active one.

### Detailed Design

The implementation will be divided into five new modules: `companies`, `tenants`, `plans`, `subscriptions`, and `payments`.

#### 1. `companies` Module

This module manages companies. A company is the top-level, billable entity.

**Domain (`src/companies/domain/company.ts`):**

```typescript
import { Tenant } from '../../tenants/domain/tenant';
import { Subscription } from '../../subscriptions/domain/subscription';

export class Company {
  id: number;
  name: string;
  tenant?: Tenant;
  subscriptions?: Subscription[];
  activeSubscription?: Subscription | null; // Direct reference to active subscription
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
```

**Infrastructure (`src/companies/infrastructure/persistence/relational/entities/company.entity.ts`):**

```typescript
import { Column, Entity, Index, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { TenantEntity } from 'src/tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { SubscriptionEntity } from 'src/subscriptions/infrastructure/persistence/relational/entities/subscription.entity';

@Entity({ name: 'company' })
export class CompanyEntity extends EntityRelationalHelper {
  @Index()
  @Column()
  name: string;

  @OneToOne(() => TenantEntity, (tenant) => tenant.company)
  tenant?: TenantEntity;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.company)
  subscriptions?: SubscriptionEntity[];

  @OneToOne(() => SubscriptionEntity)
  @JoinColumn()
  activeSubscription?: SubscriptionEntity | null;
}
```

#### 2. `tenants` Module

This module manages tenants. A tenant is a self-contained workspace linked one-to-one with a company.

**User Module Update:**

A `User` belongs to one `Tenant` and has a denormalized reference to the active subscription for quick access.

**`src/users/domain/user.ts`:**

```typescript
import { Tenant } from '../../tenants/domain/tenant';
import { Subscription } from '../../subscriptions/domain/subscription';

export class User {
  // ... other properties
  tenant: Tenant;
  activeSubscription?: Subscription | null; // Direct reference for easy access
}
```

**`src/users/infrastructure/persistence/relational/entities/user.entity.ts`:**
```typescript
import { TenantEntity } from 'src/tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { SubscriptionEntity } from 'src/subscriptions/infrastructure/persistence/relational/entities/subscription.entity';
import { ManyToOne, JoinColumn } from 'typeorm';

export class UserEntity extends EntityRelationalHelper {
  // ... other properties

  @ManyToOne(() => TenantEntity, (tenant) => tenant.users)
  tenant: TenantEntity;

  @ManyToOne(() => SubscriptionEntity)
  @JoinColumn()
  activeSubscription?: SubscriptionEntity | null;
}
```

#### 3. `subscriptions` Module

A `Subscription` belongs to a `Company`.

**Domain (`src/subscriptions/domain/subscription.ts`):**

```typescript
import { Company } from '../../companies/domain/company';
import { Plan } from '../../plans/domain/plan';

export enum SubscriptionStatusEnum {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  EXPIRED = 'expired',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
}

export class Subscription {
  id: number;
  company: Company;
  plan: Plan;
  status: SubscriptionStatusEnum;
  // ... other subscription properties
}
```

---

### Proposed Solution

1.  **User Signup Flow:**
    *   A new user signs up.
    *   A new `Company` is created.
    *   A new `Subscription` is created for the `Company` with `ACTIVE` status.
    *   The `activeSubscription` reference on the `Company` is set to this new subscription.
    *   A new `Tenant` is created and linked to the `Company`.
    *   The user is created, associated with the `Tenant`, and their `activeSubscription` reference is set.

2.  **Plan Upgrade Flow:**
    *   A user requests to upgrade the plan.
    *   The service layer finds the company's current active subscription and deactivates it.
    *   A new `Subscription` record is created with the new plan and an `ACTIVE` status.
    *   **Crucially**, the `activeSubscription` reference on the `Company` and all `Users` within that company's tenant must be updated to point to the new active subscription.

### Future Considerations
*   **Data Integrity**: The business logic must strictly enforce that the `activeSubscription` references on `Company` and `User` entities are kept in sync. This should be handled atomically within a transaction in the application's service layer whenever a subscription status changes.
*   **Performance**: For tenants with a very large number of users, the operation to update the `activeSubscription` on all users needs to be efficient. This could be done via a single bulk update query.