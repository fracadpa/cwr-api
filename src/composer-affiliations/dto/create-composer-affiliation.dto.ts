import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateComposerAffiliationDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  composerId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  publicSocietyId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  mechanicalSocietyId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty({ example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  tenantId: string;
}
