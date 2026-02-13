import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class tenantsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
