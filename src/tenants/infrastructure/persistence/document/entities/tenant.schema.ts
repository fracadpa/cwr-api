import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { CompanySchemaClass } from '../../../../../companies/infrastructure/persistence/document/entities/company.schema';

export type TenantSchemaDocument = HydratedDocument<TenantSchemaClass>; // Corrected

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class TenantSchemaClass extends EntityDocumentHelper {
  // Corrected
  @Prop({ unique: true })
  name: string;

  @Prop({ type: CompanySchemaClass })
  company: CompanySchemaClass;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(TenantSchemaClass); // Corrected
