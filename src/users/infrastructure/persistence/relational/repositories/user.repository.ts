import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository, In, EntityManager } from 'typeorm'; // Changed QueryRunner to EntityManager
import { UserEntity } from '../entities/user.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from '../../../../dto/query-user.dto';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class UsersRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: User, manager?: EntityManager): Promise<User> {
    // Changed queryRunner to manager
    const persistenceModel = UserMapper.toPersistence(data);
    const entityToSave = this.usersRepository.create(persistenceModel);
    let newEntity: UserEntity;
    if (manager) {
      newEntity = await manager.save(UserEntity, entityToSave);
    } else {
      newEntity = await this.usersRepository.save(entityToSave);
    }
    return UserMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const where: FindOptionsWhere<UserEntity> = {};
    if (filterOptions?.roles?.length) {
      where.role = filterOptions.roles.map((role) => ({
        id: Number(role.id),
      }));
    }

    const entities = await this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
      relations: {
        photo: true,
        role: true,
        status: true,
        tenant: true,
        activeSubscription: true,
      },
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: { id: Number(id) },
      relations: {
        photo: true,
        role: true,
        status: true,
        tenant: true,
        activeSubscription: true,
      },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIds(ids: User['id'][]): Promise<User[]> {
    const entities = await this.usersRepository.find({
      where: { id: In(ids) },
      relations: {
        photo: true,
        role: true,
        status: true,
        tenant: true,
        activeSubscription: true,
      },
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findByEmail(
    email: User['email'],
    manager?: EntityManager,
  ): Promise<NullableType<User>> {
    if (!email) return null;
    const repository = manager
      ? manager.getRepository(UserEntity)
      : this.usersRepository;
    const entity = await repository.findOne({
      where: { email },
      relations: {
        photo: true,
        role: true,
        status: true,
        tenant: true,
        activeSubscription: true,
      },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    if (!socialId || !provider) return null;

    const entity = await this.usersRepository.findOne({
      where: { socialId, provider },
      relations: {
        photo: true,
        role: true,
        status: true,
        tenant: true,
        activeSubscription: true,
      },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(
    id: User['id'],
    payload: Partial<User>,
    manager?: EntityManager, // Changed queryRunner to manager
  ): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const entityToUpdate = this.usersRepository.create(
      // Declare only once
      UserMapper.toPersistence({
        ...UserMapper.toDomain(entity),
        ...payload,
      }),
    );

    let updatedEntity: UserEntity;
    if (manager) {
      updatedEntity = await manager.save(UserEntity, entityToUpdate);
    } else {
      updatedEntity = await this.usersRepository.save(entityToUpdate);
    }

    return UserMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id'], manager?: EntityManager): Promise<void> {
    if (manager) {
      await manager.softDelete(UserEntity, id);
    } else {
      await this.usersRepository.softDelete(id);
    }
  }
}
