import { Module } from '@nestjs/common';
import { TenantRepository } from '../tenant.repository'; // Corrected
import { TenantRelationalRepository } from './repositories/tenant.repository'; // Corrected
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './entities/tenant.entity'; // Corrected

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity])], // Corrected
  providers: [
    {
      provide: TenantRepository, // Corrected
      useClass: TenantRelationalRepository, // Corrected
    },
  ],
  exports: [TenantRepository], // Corrected
})
export class RelationalTenantPersistenceModule {} // Corrected
