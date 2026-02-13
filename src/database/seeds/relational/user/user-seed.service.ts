import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { CompanyEntity } from '../../../../companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { SubscriptionEntity } from '../../../../subscriptions/infrastructure/persistence/relational/entities/subscription.entity';
import { PlansService } from '../../../../plans/plans.service';
import { CompaniesService } from '../../../../companies/companies.service';
import { SubscriptionsService } from '../../../../subscriptions/subscriptions.service';
import { TenantsService } from '../../../../tenants/tenants.service';
import { Plan } from '../../../../plans/domain/plans';
import { Company } from '../../../../companies/domain/companies';
import { Subscription } from '../../../../subscriptions/domain/subscriptions';
import { Tenant } from '../../../../tenants/domain/tenants';
import { CreateTenantDto } from '../../../../tenants/dto/create-tenant.dto';
import { SubscriptionStatusEnum } from '../../../../subscriptions/domain/subscription-status.enum';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    private readonly plansService: PlansService,
    private readonly companiesService: CompaniesService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly tenantsService: TenantsService,
  ) {}

  async run() {
    // Find or create default plan
    let freePlan: Plan | null = await this.plansService.findDefaultPlan();
    if (!freePlan) {
      freePlan = await this.plansService.create({
        name: 'Free',
        price: 0,
      });
    }

    // Create a new company
    let seedCompany: Company | null =
      await this.companiesService.findByName('Seed Company');
    if (!seedCompany) {
      seedCompany = await this.companiesService.create({
        name: 'Seed Company',
      });
    }

    // Create a subscription for the company
    let companySubscription: Subscription | null =
      await this.subscriptionsService.findActiveSubscriptionByCompanyId(
        seedCompany.id,
      );
    if (!companySubscription) {
      companySubscription = await this.subscriptionsService.create({
        companyId: seedCompany.id,
        planId: freePlan.id,
        status: SubscriptionStatusEnum.ACTIVE,
      });
    }

    // Create a tenant named 'main' for the company
    let mainTenant: Tenant | null = await this.tenantsService.findByName(
      'main',
      seedCompany.id,
    );
    if (!mainTenant) {
      const createTenantDto: CreateTenantDto = {
        name: 'main',
        companyId: seedCompany.id,
      };
      mainTenant = await this.tenantsService.create(createTenantDto);
    }

    // Create admin user
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
        company: {
          id: seedCompany.id,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@example.com',
          password,
          role: {
            id: RoleEnum.admin,
          } as RoleEntity,
          status: {
            id: StatusEnum.active,
          } as StatusEntity,
          company: seedCompany as CompanyEntity,
          tenant: mainTenant as TenantEntity,
          activeSubscription: companySubscription as SubscriptionEntity,
        }),
      );
    }

    // Create regular user
    const countUser = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.user,
        },
        company: {
          id: seedCompany.id,
        },
      },
    });

    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password,
          role: {
            id: RoleEnum.user,
          } as RoleEntity,
          status: {
            id: StatusEnum.active,
          } as StatusEntity,
          company: seedCompany as CompanyEntity,
          tenant: mainTenant as TenantEntity,
          activeSubscription: companySubscription as SubscriptionEntity,
        }),
      );
    }
  }
}
