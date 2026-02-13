import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TenantDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  id: string;
}
