import { ComposerAffiliation } from '../../domain/composer-affiliation';
import { CreateComposerAffiliationDto } from '../../dto/create-composer-affiliation.dto';
import { UpdateComposerAffiliationDto } from '../../dto/update-composer-affiliation.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';

export abstract class ComposerAffiliationRepository {
  abstract create(
    createPayload: CreateComposerAffiliationDto,
  ): Promise<ComposerAffiliation>;

  abstract findManyWithPagination(
    paginationOptions: IPaginationOptions,
    filterOptions?: { composerId?: number | null },
  ): Promise<ComposerAffiliation[]>;

  abstract findOne(
    fields: EntityCondition<ComposerAffiliation>,
  ): Promise<NullableType<ComposerAffiliation>>;

  abstract update(
    id: ComposerAffiliation['id'],
    updatePayload: UpdateComposerAffiliationDto,
  ): Promise<ComposerAffiliation>;

  abstract softDelete(id: ComposerAffiliation['id']): Promise<void>;
}
