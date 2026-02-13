import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class plansDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
