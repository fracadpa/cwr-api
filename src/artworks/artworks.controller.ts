import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Artwork } from './domain/artwork';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllArtworksDto } from './dto/find-all-artworks.dto';

@ApiTags('Artworks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'artworks',
  version: '1',
})
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Post()
  @ApiCreatedResponse({
    type: Artwork,
  })
  create(@Body() createArtworkDto: CreateArtworkDto, @Request() request) {
    return this.artworksService.create(createArtworkDto, request.user);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Artwork),
  })
  async findAll(
    @Query() query: FindAllArtworksDto,
  ): Promise<InfinityPaginationResponseDto<Artwork>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.artworksService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Artwork,
  })
  findById(@Param('id') id: string) {
    return this.artworksService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Artwork,
  })
  update(@Param('id') id: string, @Body() updateArtworkDto: UpdateArtworkDto) {
    return this.artworksService.update(id, updateArtworkDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.artworksService.remove(id);
  }
}
