import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CwrCapacityEnum } from '../domain/cwr-capacity.enum';

export class CreateIpCapacityDto {
  @ApiProperty({
    type: String,
    example: 'Writer',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'W',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    enum: CwrCapacityEnum,
    example: CwrCapacityEnum.ACQUIRER,
  })
  @IsNotEmpty()
  @IsEnum(CwrCapacityEnum)
  cwrCapacity: CwrCapacityEnum;
}
