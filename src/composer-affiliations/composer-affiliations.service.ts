import { Injectable } from '@nestjs/common';
import { ComposerAffiliationRepository } from './infrastructure/persistence/composer-affiliation.repository';
import { CreateComposerAffiliationDto } from './dto/create-composer-affiliation.dto';
import { UpdateComposerAffiliationDto } from './dto/update-composer-affiliation.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { ComposerAffiliation } from './domain/composer-affiliation';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';

@Injectable()
export class ComposerAffiliationsService {
  constructor(
    private readonly composerAffiliationRepository: ComposerAffiliationRepository,
  ) {}

  create(
    createPayload: CreateComposerAffiliationDto,
  ): Promise<ComposerAffiliation> {
    return this.composerAffiliationRepository.create(createPayload);
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    filterOptions?: { composerId?: number | null },
  ): Promise<ComposerAffiliation[]> {
    return this.composerAffiliationRepository.findManyWithPagination(
      paginationOptions,
      filterOptions,
    );
  }

  findOne(
    fields: EntityCondition<ComposerAffiliation>,
  ): Promise<NullableType<ComposerAffiliation>> {
    return this.composerAffiliationRepository.findOne(fields);
  }

  update(
    id: ComposerAffiliation['id'],
    updatePayload: UpdateComposerAffiliationDto,
  ): Promise<ComposerAffiliation> {
    return this.composerAffiliationRepository.update(id, updatePayload);
  }

  remove(id: ComposerAffiliation['id']): Promise<void> {
    return this.composerAffiliationRepository.softDelete(id);
  }
}
