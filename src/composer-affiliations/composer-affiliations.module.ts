import { Module } from '@nestjs/common';
import { ComposerAffiliationsService } from './composer-affiliations.service';
import { ComposerAffiliationsController } from './composer-affiliations.controller';
import { RelationalComposerAffiliationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ComposersModule } from '@app/composers/composers.module';
import { SocietiesModule } from '@app/societies/societies.module';
import { CompaniesModule } from '@app/companies/companies.module';
import { TenantsModule } from '@app/tenants/tenants.module';

@Module({
  imports: [
    RelationalComposerAffiliationPersistenceModule,
    ComposersModule,
    SocietiesModule,
    CompaniesModule,
    TenantsModule,
  ],
  controllers: [ComposerAffiliationsController],
  providers: [ComposerAffiliationsService],
  exports: [ComposerAffiliationsService],
})
export class ComposerAffiliationsModule {}
