import { PartialType } from '@nestjs/swagger';
import { CreatePublisherAffiliationTerritoryDto } from './create-publisher-affiliation-territory.dto';

export class UpdatePublisherAffiliationTerritoryDto extends PartialType(
  CreatePublisherAffiliationTerritoryDto,
) {}
