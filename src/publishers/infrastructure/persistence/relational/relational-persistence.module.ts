import { Module } from '@nestjs/common';
import { PublisherRepository } from '../publisher.repository';
import { PublisherRelationalRepository } from './repositories/publisher.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherEntity } from './entities/publisher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublisherEntity])],
  providers: [
    {
      provide: PublisherRepository,
      useClass: PublisherRelationalRepository,
    },
  ],
  exports: [PublisherRepository],
})
export class RelationalPublisherPersistenceModule {}
