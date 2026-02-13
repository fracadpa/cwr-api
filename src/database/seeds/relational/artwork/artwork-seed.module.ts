import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from '../../../../artworks/infrastructure/persistence/relational/entities/artwork.entity';
import { CompanyEntity } from '../../../../companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { ArtworkSeedService } from './artwork-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArtworkEntity,
      CompanyEntity,
      TenantEntity,
      UserEntity,
    ]),
  ],
  providers: [ArtworkSeedService],
  exports: [ArtworkSeedService],
})
export class ArtworkSeedModule {}
