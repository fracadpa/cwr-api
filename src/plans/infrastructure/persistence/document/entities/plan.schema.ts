import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type PlanSchemaDocument = HydratedDocument<PlanSchemaClass>; // Corrected

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class PlanSchemaClass extends EntityDocumentHelper {
  // Corrected
  @Prop({ unique: true })
  name: string;

  @Prop()
  price: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const PlanSchema = SchemaFactory.createForClass(PlanSchemaClass); // Corrected
