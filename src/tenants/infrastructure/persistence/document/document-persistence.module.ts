import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TenantSchema, // Corrected
  TenantSchemaClass, // Corrected
} from './entities/tenant.schema'; // Corrected
import { TenantRepository } from '../tenant.repository'; // Corrected
import { TenantDocumentRepository } from './repositories/tenant.repository'; // Corrected

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TenantSchemaClass.name, schema: TenantSchema }, // Corrected
    ]),
  ],
  providers: [
    {
      provide: TenantRepository, // Corrected
      useClass: TenantDocumentRepository, // Corrected
    },
  ],
  exports: [TenantRepository], // Corrected
})
export class DocumentTenantPersistenceModule {} // Corrected
