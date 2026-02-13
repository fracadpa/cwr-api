import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { SubscriptionStatusEnum } from '../domain/subscription-status.enum';

export class CreateSubscriptionDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  planId: number;

  @ApiProperty({
    enum: SubscriptionStatusEnum,
  })
  @IsEnum(SubscriptionStatusEnum)
  status: SubscriptionStatusEnum;
}
