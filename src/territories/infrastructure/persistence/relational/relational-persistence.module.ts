import { Module } from '@nestjs/common';
import { TerritoryRepository } from '../territory.repository';
import { TerritoryRelationalRepository } from './repositories/territory.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerritoryEntity } from './entities/territory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TerritoryEntity])],
  providers: [
    {
      provide: TerritoryRepository,
      useClass: TerritoryRelationalRepository,
    },
  ],
  exports: [TerritoryRepository],
})
export class RelationalTerritoryPersistenceModule {}
