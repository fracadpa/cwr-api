import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Artwork } from './domain/artwork';
import { EntityManager } from 'typeorm';
import { ArtworkRepository } from './infrastructure/persistence/artwork.repository';
import { User } from '../users/domain/user';

@Injectable()
export class ArtworksService {
  constructor(private readonly artworksRepository: ArtworkRepository) {}

  async create(
    createArtworkDto: CreateArtworkDto,
    user: User,
    manager?: EntityManager,
  ) {
    const newArtwork = new Artwork();
    newArtwork.title = createArtworkDto.title;
    newArtwork.artist = createArtworkDto.artist;
    newArtwork.year = createArtworkDto.year;
    newArtwork.medium = createArtworkDto.medium;
    newArtwork.dimensions = createArtworkDto.dimensions;
    newArtwork.price = createArtworkDto.price;
    newArtwork.imageUrl = createArtworkDto.imageUrl;

    // Set relationships from the authenticated user
    if (user.company) {
      newArtwork.company = user.company;
    }
    if (user.tenant) {
      newArtwork.tenant = user.tenant;
    }
    newArtwork.createdBy = user;

    return await this.artworksRepository.create(newArtwork, manager);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.artworksRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Artwork['id'], manager?: EntityManager) {
    return this.artworksRepository.findById(id, manager);
  }

  async update(
    id: Artwork['id'],
    payload: DeepPartial<Artwork>,
    manager?: EntityManager,
  ) {
    const entity = await this.artworksRepository.findById(id, manager);

    if (!entity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: { id: 'artworkNotFound' },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.artworksRepository.update(id, payload, manager);
  }

  remove(id: Artwork['id']) {
    return this.artworksRepository.remove(id);
  }
}
