import { Module } from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { ArtworksController } from './artworks.controller';
import { RelationalArtworkPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalArtworkPersistenceModule],
  controllers: [ArtworksController],
  providers: [ArtworksService],
  exports: [ArtworksService, RelationalArtworkPersistenceModule],
})
export class ArtworksModule {}
