import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatusEnum } from './subscription-status.enum';
import { Company } from '../../companies/domain/companies';
import { Plan } from '../../plans/domain/plans'; // Import Plan

export class Subscription {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    enum: SubscriptionStatusEnum,
    type: String,
  })
  status: SubscriptionStatusEnum;

  company: Company;

  plan: Plan; // Add plan property

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
