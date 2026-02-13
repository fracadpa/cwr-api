import { ApiProperty } from '@nestjs/swagger';
import { CwrVersionEnum } from './cwr-version.enum';

export class Society {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  cwrSocietyId: number | null;

  @ApiProperty({
    type: () => Society,
    nullable: true,
  })
  cwrSociety: Society | null;

  @ApiProperty({
    enum: CwrVersionEnum,
  })
  cwrVer: CwrVersionEnum;

  @ApiProperty({
    type: String,
  })
  cisacCode: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
