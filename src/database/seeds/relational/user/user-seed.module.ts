import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user-seed.service';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { PlansModule } from '../../../../plans/plans.module';
import { CompaniesModule } from '../../../../companies/companies.module';
import { SubscriptionsModule } from '../../../../subscriptions/subscriptions.module';
import { TenantsModule } from '../../../../tenants/tenants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PlansModule,
    CompaniesModule,
    SubscriptionsModule,
    TenantsModule,
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
