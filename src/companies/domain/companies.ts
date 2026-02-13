import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../../tenants/domain/tenants';
import { Subscription } from '../../subscriptions/domain/subscriptions';

export class Company {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  name: string;

  tenants: Tenant[];

  subscriptions: Subscription[];

  activeSubscription: Subscription | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
