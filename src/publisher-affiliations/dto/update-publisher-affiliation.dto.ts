import { PartialType } from '@nestjs/mapped-types';
import { CreatePublisherAffiliationDto } from './create-publisher-affiliation.dto';

export class UpdatePublisherAffiliationDto extends PartialType(
  CreatePublisherAffiliationDto,
) {}
