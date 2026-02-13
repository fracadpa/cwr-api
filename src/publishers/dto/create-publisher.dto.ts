import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ControlledPublisherEnum } from '../domain/controlled-publisher.enum';

export class CreatePublisherDto {
  @ApiProperty({
    type: String,
    example: 'Universal Music Publishing',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'UMP001',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    enum: ControlledPublisherEnum,
    example: ControlledPublisherEnum.OWNED,
  })
  @IsNotEmpty()
  @IsEnum(ControlledPublisherEnum)
  controlledPublisher: ControlledPublisherEnum;

  @ApiProperty({
    type: String,
    example: '00000000000',
  })
  @IsNotEmpty()
  @IsString()
  ipiNumber: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  ipCapacityId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty({
    type: String,
    example: 'uuid-string',
  })
  @IsNotEmpty()
  @IsString()
  tenantId: string;
}
