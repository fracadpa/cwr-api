import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { SubscriptionStatusEnum } from '../../../../domain/subscription-status.enum';
import { CompanySchemaClass } from '../../../../../companies/infrastructure/persistence/document/entities/company.schema';
import { PlanSchemaClass } from '../../../../../plans/infrastructure/persistence/document/entities/plan.schema';

export type SubscriptionSchemaDocument =
  HydratedDocument<SubscriptionSchemaClass>; // Corrected

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class SubscriptionSchemaClass extends EntityDocumentHelper {
  // Corrected
  @Prop({
    type: String,
    enum: SubscriptionStatusEnum,
    default: SubscriptionStatusEnum.INCOMPLETE,
  })
  status: SubscriptionStatusEnum;

  @Prop({ type: CompanySchemaClass })
  company: CompanySchemaClass;

  @Prop({ type: PlanSchemaClass })
  plan: PlanSchemaClass;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(
  // Corrected
  SubscriptionSchemaClass,
);
