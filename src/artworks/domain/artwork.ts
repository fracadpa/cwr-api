import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../companies/domain/companies';
import { Tenant } from '../../tenants/domain/tenants';
import { User } from '../../users/domain/user';

export class Artwork {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  title: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  artist?: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  year?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  medium?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  dimensions?: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  price?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  imageUrl?: string;

  company: Company;

  tenant: Tenant;

  createdBy: User;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
