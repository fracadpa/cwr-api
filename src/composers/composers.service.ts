import { Injectable } from '@nestjs/common';
import { ComposerRepository } from './infrastructure/persistence/composer.repository';
import { CreateComposerDto } from './dto/create-composer.dto';
import { UpdateComposerDto } from './dto/update-composer.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { Composer } from './domain/composer';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';

@Injectable()
export class ComposersService {
  constructor(private readonly composerRepository: ComposerRepository) {}

  create(createPayload: CreateComposerDto): Promise<Composer> {
    return this.composerRepository.create(createPayload);
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Composer[]> {
    return this.composerRepository.findManyWithPagination(paginationOptions);
  }

  findOne(fields: EntityCondition<Composer>): Promise<NullableType<Composer>> {
    return this.composerRepository.findOne(fields);
  }

  update(
    id: Composer['id'],
    updatePayload: UpdateComposerDto,
  ): Promise<Composer> {
    return this.composerRepository.update(id, updatePayload);
  }

  remove(id: Composer['id']): Promise<void> {
    return this.composerRepository.softDelete(id);
  }
}
