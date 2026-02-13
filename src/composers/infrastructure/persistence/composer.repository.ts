import { Composer } from '../../domain/composer';
import { CreateComposerDto } from '../../dto/create-composer.dto';
import { UpdateComposerDto } from '../../dto/update-composer.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';

export abstract class ComposerRepository {
  abstract create(createPayload: CreateComposerDto): Promise<Composer>;

  abstract findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Composer[]>;

  abstract findOne(
    fields: EntityCondition<Composer>,
  ): Promise<NullableType<Composer>>;

  abstract update(
    id: Composer['id'],
    updatePayload: UpdateComposerDto,
  ): Promise<Composer>;

  abstract softDelete(id: Composer['id']): Promise<void>;
}
