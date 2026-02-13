import { Module } from '@nestjs/common';
import { SocietyRepository } from '../society.repository';
import { SocietyRelationalRepository } from './repositories/society.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocietyEntity } from './entities/society.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocietyEntity])],
  providers: [
    {
      provide: SocietyRepository,
      useClass: SocietyRelationalRepository,
    },
  ],
  exports: [SocietyRepository],
})
export class RelationalSocietyPersistenceModule {}
