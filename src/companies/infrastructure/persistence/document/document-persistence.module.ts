import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompanySchema, // Corrected
  CompanySchemaClass, // Corrected
} from './entities/company.schema'; // Corrected
import { CompanyRepository } from '../company.repository'; // Corrected
import { CompanyDocumentRepository } from './repositories/company.repository'; // Corrected

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanySchemaClass.name, schema: CompanySchema }, // Corrected
    ]),
  ],
  providers: [
    {
      provide: CompanyRepository, // Corrected
      useClass: CompanyDocumentRepository, // Corrected
    },
  ],
  exports: [CompanyRepository], // Corrected
})
export class DocumentCompanyPersistenceModule {} // Corrected
