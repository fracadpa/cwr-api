import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { PlansService } from './plans.service'; // Corrected
import { PlansController } from './plans.controller'; // Corrected
import { RelationalPlanPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'; // Corrected
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentPlanPersistenceModule } from './infrastructure/persistence/document/document-persistence.module'; // Corrected

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentPlanPersistenceModule
  : RelationalPlanPersistenceModule;

@Module({
  imports: [
    // do not remove this comment
    infrastructurePersistenceModule,
  ],
  controllers: [PlansController], // Corrected
  providers: [PlansService], // Corrected
  exports: [PlansService, infrastructurePersistenceModule], // Corrected
})
export class PlansModule {} // Corrected
