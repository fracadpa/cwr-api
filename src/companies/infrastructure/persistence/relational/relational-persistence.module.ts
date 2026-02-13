import { Module } from '@nestjs/common';
import { CompanyRepository } from '../company.repository'; // Corrected
import { CompanyRelationalRepository } from './repositories/company.repository'; // Corrected
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity'; // Corrected

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])], // Corrected
  providers: [
    {
      provide: CompanyRepository, // Corrected
      useClass: CompanyRelationalRepository, // Corrected
    },
  ],
  exports: [CompanyRepository], // Corrected
})
export class RelationalCompanyPersistenceModule {} // Corrected
