import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../companies/domain/companies';
import { User } from '../../users/domain/user';

export class Tenant {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  name: string;

  company: Company;

  users: User[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
