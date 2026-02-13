import { PartialType } from '@nestjs/swagger';
import { CreateComposerDto } from './create-composer.dto';

export class UpdateComposerDto extends PartialType(CreateComposerDto) {}
