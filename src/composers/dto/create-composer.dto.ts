import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ControlledComposerEnum } from '../domain/controlled-composer.enum';

export class CreateComposerDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'COMP-001' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    enum: ControlledComposerEnum,
    example: ControlledComposerEnum.Owned,
  })
  @IsNotEmpty()
  @IsEnum(ControlledComposerEnum)
  controlledComposer: ControlledComposerEnum;

  @ApiPropertyOptional({ example: 'I-000000001-2' })
  @IsOptional()
  @IsString()
  ipiComposer?: string;

  @ApiPropertyOptional({ example: 'JD' })
  @IsOptional()
  @IsString()
  composerAlias?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  ipCapacityId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty({ example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  tenantId: string;
}
