import { Module } from '@nestjs/common';
import { PublisherAffiliationTerritoriesService } from './publisher-affiliation-territories.service';
import { PublisherAffiliationTerritoriesController } from './publisher-affiliation-territories.controller';
import { RelationalPublisherAffiliationTerritoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { PublisherAffiliationsModule } from '@app/publisher-affiliations/publisher-affiliations.module';
import { TerritoriesModule } from '@app/territories/territories.module';

@Module({
  imports: [
    RelationalPublisherAffiliationTerritoryPersistenceModule,
    PublisherAffiliationsModule,
    TerritoriesModule,
  ],
  controllers: [PublisherAffiliationTerritoriesController],
  providers: [PublisherAffiliationTerritoriesService],
  exports: [PublisherAffiliationTerritoriesService],
})
export class PublisherAffiliationTerritoriesModule {}
