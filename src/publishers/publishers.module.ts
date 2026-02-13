import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { RelationalPublisherPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { IpCapacitiesModule } from '../ip-capacities/ip-capacities.module';
import { CompaniesModule } from '../companies/companies.module';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [
    RelationalPublisherPersistenceModule,
    IpCapacitiesModule,
    CompaniesModule,
    TenantsModule,
  ],
  controllers: [PublishersController],
  providers: [PublishersService],
  exports: [PublishersService, RelationalPublisherPersistenceModule],
})
export class PublishersModule {}
