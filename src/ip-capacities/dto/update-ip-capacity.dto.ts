import { PartialType } from '@nestjs/swagger';
import { CreateIpCapacityDto } from './create-ip-capacity.dto';

export class UpdateIpCapacityDto extends PartialType(CreateIpCapacityDto) {}
