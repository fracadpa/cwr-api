import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanSchema, PlanSchemaClass } from './entities/plan.schema'; // Corrected
import { PlanRepository } from '../plan.repository'; // Corrected
import { PlanDocumentRepository } from './repositories/plan.repository'; // Corrected

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlanSchemaClass.name, schema: PlanSchema }, // Corrected
    ]),
  ],
  providers: [
    {
      provide: PlanRepository, // Corrected
      useClass: PlanDocumentRepository, // Corrected
    },
  ],
  exports: [PlanRepository], // Corrected
})
export class DocumentPlanPersistenceModule {} // Corrected
