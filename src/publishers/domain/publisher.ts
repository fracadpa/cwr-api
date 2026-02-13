import { ApiProperty } from '@nestjs/swagger';
import { ControlledPublisherEnum } from './controlled-publisher.enum';
import { IpCapacity } from '../../ip-capacities/domain/ip-capacity';
import { Company } from '../../companies/domain/companies';
import { Tenant } from '../../tenants/domain/tenants';

export class Publisher {
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
    enum: ControlledPublisherEnum,
  })
  controlledPublisher: ControlledPublisherEnum;

  @ApiProperty({
    type: String,
  })
  ipiNumber: string;

  @ApiProperty({
    type: () => IpCapacity,
  })
  ipCapacity: IpCapacity;

  @ApiProperty({
    type: () => Company,
  })
  company: Company;

  @ApiProperty({
    type: () => Tenant,
  })
  tenant: Tenant;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
