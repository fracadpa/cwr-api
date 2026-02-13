import { Module } from '@nestjs/common';
import { TerritoriesService } from './territories.service';
import { TerritoriesController } from './territories.controller';
import { RelationalTerritoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalTerritoryPersistenceModule],
  controllers: [TerritoriesController],
  providers: [TerritoriesService],
  exports: [TerritoriesService, RelationalTerritoryPersistenceModule],
})
export class TerritoriesModule {}
