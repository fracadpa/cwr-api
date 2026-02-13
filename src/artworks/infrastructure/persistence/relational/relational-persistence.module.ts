import { Module } from '@nestjs/common';
import { ArtworkRepository } from '../artwork.repository';
import { ArtworkRelationalRepository } from './repositories/artwork.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from './entities/artwork.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArtworkEntity])],
  providers: [
    {
      provide: ArtworkRepository,
      useClass: ArtworkRelationalRepository,
    },
  ],
  exports: [ArtworkRepository],
})
export class RelationalArtworkPersistenceModule {}
