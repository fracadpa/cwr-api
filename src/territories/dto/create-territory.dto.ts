import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTerritoryDto {
  @ApiProperty({
    type: String,
    example: 'United States',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'US',
  })
  @IsNotEmpty()
  @IsString()
  tisCode: string;
}
