import { NestFactory } from '@nestjs/core';
import { ArtworkSeedService } from './artwork/artwork-seed.service';
import { SeedModule } from './seed.module';

const runSeed = async () => {
  try {
    const app = await NestFactory.create(SeedModule);
    console.log('App created successfully');

    await app.get(ArtworkSeedService).run();
    console.log('Artwork seed completed');

    await app.close();
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
};

void runSeed();
