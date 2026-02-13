import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherAffiliationTerritoryEntity } from './entities/publisher-affiliation-territory.entity';
import { PublisherAffiliationTerritoryRepository } from '../publisher-affiliation-territory.repository';
import { PublisherAffiliationTerritoryRelationalRepository } from './repositories/publisher-affiliation-territory.repository';
import { PublisherAffiliationEntity } from '@app/publisher-affiliations/infrastructure/persistence/relational/entities/publisher-affiliation.entity';
import { TerritoryEntity } from '@app/territories/infrastructure/persistence/relational/entities/territory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PublisherAffiliationTerritoryEntity,
      PublisherAffiliationEntity,
      TerritoryEntity,
    ]),
  ],
  providers: [
    {
      provide: PublisherAffiliationTerritoryRepository,
      useClass: PublisherAffiliationTerritoryRelationalRepository,
    },
  ],
  exports: [PublisherAffiliationTerritoryRepository],
})
export class RelationalPublisherAffiliationTerritoryPersistenceModule {}
