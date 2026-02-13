import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CwrVersionEnum } from '../domain/cwr-version.enum';

export class CreateSocietyDto {
  @ApiProperty({
    type: String,
    example: 'ASCAP',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  cwrSocietyId?: number | null;

  @ApiProperty({
    enum: CwrVersionEnum,
    example: CwrVersionEnum.V2_2,
  })
  @IsNotEmpty()
  @IsEnum(CwrVersionEnum)
  cwrVer: CwrVersionEnum;

  @ApiProperty({
    type: String,
    example: '010',
  })
  @IsNotEmpty()
  @IsString()
  cisacCode: string;
}
