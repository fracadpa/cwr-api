import { Module } from '@nestjs/common';
import { ComposersService } from './composers.service';
import { ComposersController } from './composers.controller';
import { RelationalComposerPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { IpCapacitiesModule } from '@app/ip-capacities/ip-capacities.module';
import { CompaniesModule } from '@app/companies/companies.module';
import { TenantsModule } from '@app/tenants/tenants.module';

@Module({
  imports: [
    RelationalComposerPersistenceModule,
    IpCapacitiesModule,
    CompaniesModule,
    TenantsModule,
  ],
  controllers: [ComposersController],
  providers: [ComposersService],
  exports: [ComposersService],
})
export class ComposersModule {}
