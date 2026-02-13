import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service'; // Corrected
import { SubscriptionsController } from './subscriptions.controller'; // Corrected
import { RelationalSubscriptionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'; // Corrected
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentSubscriptionPersistenceModule } from './infrastructure/persistence/document/document-persistence.module'; // Corrected

import { CompaniesModule } from '../companies/companies.module'; // Import CompaniesModule
import { PlansModule } from '../plans/plans.module'; // Import PlansModule

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentSubscriptionPersistenceModule
  : RelationalSubscriptionPersistenceModule;

@Module({
  imports: [
    // do not remove this comment
    infrastructurePersistenceModule,
    CompaniesModule, // Added CompaniesModule
    PlansModule, // Added PlansModule
  ],
  controllers: [SubscriptionsController], // Corrected
  providers: [SubscriptionsService], // Corrected
  exports: [SubscriptionsService, infrastructurePersistenceModule], // Corrected
})
export class SubscriptionsModule {} // Corrected
