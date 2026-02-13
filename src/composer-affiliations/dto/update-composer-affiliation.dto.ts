import { PartialType } from '@nestjs/swagger';
import { CreateComposerAffiliationDto } from './create-composer-affiliation.dto';

export class UpdateComposerAffiliationDto extends PartialType(
  CreateComposerAffiliationDto,
) {}
