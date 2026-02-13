import { Module } from '@nestjs/common';
import { PlanRepository } from '../plan.repository'; // Corrected
import { PlanRelationalRepository } from './repositories/plan.repository'; // Corrected
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity'; // Corrected

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity])], // Corrected
  providers: [
    {
      provide: PlanRepository, // Corrected
      useClass: PlanRelationalRepository, // Corrected
    },
  ],
  exports: [PlanRepository], // Corrected
})
export class RelationalPlanPersistenceModule {} // Corrected
