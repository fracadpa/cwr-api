import { Module } from '@nestjs/common';
import { IpCapacityRepository } from '../ip-capacity.repository';
import { IpCapacityRelationalRepository } from './repositories/ip-capacity.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpCapacityEntity } from './entities/ip-capacity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IpCapacityEntity])],
  providers: [
    {
      provide: IpCapacityRepository,
      useClass: IpCapacityRelationalRepository,
    },
  ],
  exports: [IpCapacityRepository],
})
export class RelationalIpCapacityPersistenceModule {}
