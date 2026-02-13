import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtworkEntity } from '../../../../artworks/infrastructure/persistence/relational/entities/artwork.entity';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../../../../companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class ArtworkSeedService {
  constructor(
    @InjectRepository(ArtworkEntity)
    private artworkRepository: Repository<ArtworkEntity>,
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
    @InjectRepository(TenantEntity)
    private tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async run() {
    const count = await this.artworkRepository.count();

    if (count === 0) {
      // Get the first company, tenant, and user for seeding
      const companies = await this.companyRepository.find({ take: 1 });
      const company = companies[0];

      const tenants = await this.tenantRepository.find({ take: 1 });
      const tenant = tenants[0];

      const users = await this.userRepository.find({ take: 1 });
      const user = users[0];

      if (!company || !tenant || !user) {
        console.log(
          'Skipping artwork seed: Company, Tenant, or User not found',
        );
        return;
      }

      const artworks = [
        {
          title: 'Starry Night',
          artist: 'Vincent van Gogh',
          year: 1889,
          medium: 'Oil on canvas',
          dimensions: '73.7 cm × 92.1 cm',
          price: 100000000,
          imageUrl: 'https://example.com/starry-night.jpg',
          company,
          tenant,
          createdBy: user,
        },
        {
          title: 'The Persistence of Memory',
          artist: 'Salvador Dalí',
          year: 1931,
          medium: 'Oil on canvas',
          dimensions: '24 cm × 33 cm',
          price: 50000000,
          imageUrl: 'https://example.com/persistence-of-memory.jpg',
          company,
          tenant,
          createdBy: user,
        },
        {
          title: 'The Scream',
          artist: 'Edvard Munch',
          year: 1893,
          medium: 'Oil, tempera, pastel and crayon on cardboard',
          dimensions: '91 cm × 73.5 cm',
          price: 119900000,
          imageUrl: 'https://example.com/the-scream.jpg',
          company,
          tenant,
          createdBy: user,
        },
        {
          title: 'Girl with a Pearl Earring',
          artist: 'Johannes Vermeer',
          year: 1665,
          medium: 'Oil on canvas',
          dimensions: '44.5 cm × 39 cm',
          price: 75000000,
          imageUrl: 'https://example.com/girl-with-pearl-earring.jpg',
          company,
          tenant,
          createdBy: user,
        },
        {
          title: 'The Great Wave off Kanagawa',
          artist: 'Katsushika Hokusai',
          year: 1831,
          medium: 'Woodblock print',
          dimensions: '25.7 cm × 37.8 cm',
          price: 2500000,
          imageUrl: 'https://example.com/great-wave.jpg',
          company,
          tenant,
          createdBy: user,
        },
      ];

      await this.artworkRepository.save(
        this.artworkRepository.create(artworks),
      );

      console.log('Successfully seeded 5 artworks');
    }
  }
}
