import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePublisherAffiliationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  publisherId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  publicSocietyId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  mechanicalSocietyId: number;
}
