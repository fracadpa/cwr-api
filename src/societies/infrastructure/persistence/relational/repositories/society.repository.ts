import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocietyEntity } from '../entities/society.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Society } from '../../../../domain/society';
import { SocietyRepository } from '../../society.repository';
import { SocietyMapper } from '../mappers/society.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SocietyRelationalRepository implements SocietyRepository {
  constructor(
    @InjectRepository(SocietyEntity)
    private readonly societiesRepository: Repository<SocietyEntity>,
  ) {}

  async create(data: Society): Promise<Society> {
    const persistenceModel = SocietyMapper.toPersistence(data);
    const entityToSave = this.societiesRepository.create(persistenceModel);
    const newEntity = await this.societiesRepository.save(entityToSave);
    return SocietyMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<Society[]> {
    const queryBuilder = this.societiesRepository
      .createQueryBuilder('society')
      .leftJoinAndSelect('society.cwrSociety', 'cwrSociety');

    if (search) {
      const escapedSearch = this.escapeSearchTerm(search);
      queryBuilder.where(
        '(society.name ILIKE :search OR society."cisacCode" ILIKE :search OR society."cwrVer"::text ILIKE :search)',
        { search: `%${escapedSearch}%` },
      );
    }

    const entities = await queryBuilder
      .orderBy('society.name', 'ASC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getMany();

    return entities.map((entity) => SocietyMapper.toDomain(entity));
  }

  private escapeSearchTerm(term: string): string {
    return term
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
  }

  async findById(id: Society['id']): Promise<NullableType<Society>> {
    const entity = await this.societiesRepository.findOne({
      where: { id },
      relations: ['cwrSociety'],
    });

    return entity ? SocietyMapper.toDomain(entity) : null;
  }

  async findByCisacCode(
    cisacCode: Society['cisacCode'],
  ): Promise<NullableType<Society>> {
    const entity = await this.societiesRepository.findOne({
      where: { cisacCode },
      relations: ['cwrSociety'],
    });

    return entity ? SocietyMapper.toDomain(entity) : null;
  }

  async update(id: Society['id'], payload: Partial<Society>): Promise<Society> {
    const entity = await this.societiesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityToUpdate = this.societiesRepository.create(
      SocietyMapper.toPersistence({
        ...SocietyMapper.toDomain(entity),
        ...payload,
      }),
    );

    const updatedEntity = await this.societiesRepository.save(entityToUpdate);

    return SocietyMapper.toDomain(updatedEntity);
  }

  async remove(id: Society['id']): Promise<void> {
    await this.societiesRepository.delete(id);
  }
}
