import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComposerEntity } from './entities/composer.entity';
import { ComposerRepository } from '@app/composers/infrastructure/persistence/composer.repository';
import { ComposerRelationalRepository } from './repositories/composer.repository';
import { IpCapacityEntity } from '@app/ip-capacities/infrastructure/persistence/relational/entities/ip-capacity.entity';
import { CompanyEntity } from '@app/companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '@app/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComposerEntity,
      IpCapacityEntity,
      CompanyEntity,
      TenantEntity,
    ]),
  ],
  providers: [
    {
      provide: ComposerRepository,
      useClass: ComposerRelationalRepository,
    },
  ],
  exports: [ComposerRepository],
})
export class RelationalComposerPersistenceModule {}
