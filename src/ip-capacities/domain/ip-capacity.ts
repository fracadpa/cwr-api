import { ApiProperty } from '@nestjs/swagger';
import { CwrCapacityEnum } from './cwr-capacity.enum';

export class IpCapacity {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  code: string;

  @ApiProperty({
    enum: CwrCapacityEnum,
  })
  cwrCapacity: CwrCapacityEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
