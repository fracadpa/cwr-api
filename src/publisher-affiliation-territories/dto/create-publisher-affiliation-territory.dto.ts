import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePublisherAffiliationTerritoryDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  publisherAffiliationId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  territoryId: number;
}
