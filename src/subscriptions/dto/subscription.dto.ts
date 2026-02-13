import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubscriptionDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
