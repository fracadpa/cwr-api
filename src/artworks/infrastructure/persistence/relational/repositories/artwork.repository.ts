import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ArtworkEntity } from '../entities/artwork.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Artwork } from '../../../../domain/artwork';
import { ArtworkRepository } from '../../artwork.repository';
import { ArtworkMapper } from '../mappers/artwork.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ArtworkRelationalRepository implements ArtworkRepository {
  constructor(
    @InjectRepository(ArtworkEntity)
    private readonly artworksRepository: Repository<ArtworkEntity>,
  ) {}

  async create(data: Artwork, manager?: EntityManager): Promise<Artwork> {
    const persistenceModel = ArtworkMapper.toPersistence(data);
    const entityToSave = this.artworksRepository.create(persistenceModel);

    let newEntity: ArtworkEntity;
    if (manager) {
      newEntity = await manager.save(ArtworkEntity, entityToSave);
    } else {
      newEntity = await this.artworksRepository.save(entityToSave);
    }
    return ArtworkMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Artwork[]> {
    const entities = await this.artworksRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['company', 'tenant', 'createdBy'],
    });

    return entities.map((entity) => ArtworkMapper.toDomain(entity));
  }

  async findById(
    id: Artwork['id'],
    manager?: EntityManager,
  ): Promise<NullableType<Artwork>> {
    const repository = manager
      ? manager.getRepository(ArtworkEntity)
      : this.artworksRepository;

    const entity = await repository.findOne({
      where: { id },
      relations: ['company', 'tenant', 'createdBy'],
    });

    return entity ? ArtworkMapper.toDomain(entity) : null;
  }

  async update(
    id: Artwork['id'],
    payload: Partial<Artwork>,
    manager?: EntityManager,
  ): Promise<Artwork> {
    const repository = manager
      ? manager.getRepository(ArtworkEntity)
      : this.artworksRepository;
    const entity = await repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityToUpdate = repository.create(
      ArtworkMapper.toPersistence({
        ...ArtworkMapper.toDomain(entity),
        ...payload,
      }),
    );

    const updatedEntity = await repository.save(entityToUpdate);

    return ArtworkMapper.toDomain(updatedEntity);
  }

  async remove(id: Artwork['id']): Promise<void> {
    await this.artworksRepository.delete(id);
  }
}
