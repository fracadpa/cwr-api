import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComposerAffiliationEntity } from './entities/composer-affiliation.entity';
import { ComposerAffiliationRepository } from '../composer-affiliation.repository';
import { ComposerAffiliationRelationalRepository } from './repositories/composer-affiliation.repository';
import { ComposerEntity } from '@app/composers/infrastructure/persistence/relational/entities/composer.entity';
import { SocietyEntity } from '@app/societies/infrastructure/persistence/relational/entities/society.entity';
import { CompanyEntity } from '@app/companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '@app/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComposerAffiliationEntity,
      ComposerEntity,
      SocietyEntity,
      CompanyEntity,
      TenantEntity,
    ]),
  ],
  providers: [
    {
      provide: ComposerAffiliationRepository,
      useClass: ComposerAffiliationRelationalRepository,
    },
  ],
  exports: [ComposerAffiliationRepository],
})
export class RelationalComposerAffiliationPersistenceModule {}
