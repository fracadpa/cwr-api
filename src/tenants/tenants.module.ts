import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { TenantsService } from './tenants.service'; // Corrected
import { TenantsController } from './tenants.controller'; // Corrected
import { RelationalTenantPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'; // Corrected
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentTenantPersistenceModule } from './infrastructure/persistence/document/document-persistence.module'; // Corrected

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentTenantPersistenceModule
  : RelationalTenantPersistenceModule;

@Module({
  imports: [
    // do not remove this comment
    infrastructurePersistenceModule,
  ],
  controllers: [TenantsController], // Corrected
  providers: [TenantsService], // Corrected
  exports: [TenantsService, infrastructurePersistenceModule], // Corrected
})
export class TenantsModule {} // Corrected
