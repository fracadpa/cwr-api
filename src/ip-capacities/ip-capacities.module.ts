import { Module } from '@nestjs/common';
import { IpCapacitiesService } from './ip-capacities.service';
import { IpCapacitiesController } from './ip-capacities.controller';
import { RelationalIpCapacityPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalIpCapacityPersistenceModule],
  controllers: [IpCapacitiesController],
  providers: [IpCapacitiesService],
  exports: [IpCapacitiesService, RelationalIpCapacityPersistenceModule],
})
export class IpCapacitiesModule {}
