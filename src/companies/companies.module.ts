import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { CompaniesService } from './companies.service'; // Corrected
import { CompaniesController } from './companies.controller'; // Corrected
import { RelationalCompanyPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'; // Corrected
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentCompanyPersistenceModule } from './infrastructure/persistence/document/document-persistence.module'; // Corrected

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentCompanyPersistenceModule
  : RelationalCompanyPersistenceModule;

@Module({
  imports: [
    // do not remove this comment
    infrastructurePersistenceModule,
  ],
  controllers: [CompaniesController], // Corrected
  providers: [CompaniesService], // Corrected
  exports: [CompaniesService, infrastructurePersistenceModule], // Corrected
})
export class CompaniesModule {}
