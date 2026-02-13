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
} from '@nestjs/common';
import { TerritoriesService } from './territories.service';
import { CreateTerritoryDto } from './dto/create-territory.dto';
import { UpdateTerritoryDto } from './dto/update-territory.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Territory } from './domain/territory';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTerritoriesDto } from './dto/find-all-territories.dto';

@ApiTags('Territories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'territories',
  version: '1',
})
export class TerritoriesController {
  constructor(private readonly territoriesService: TerritoriesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Territory,
  })
  create(@Body() createTerritoryDto: CreateTerritoryDto) {
    return this.territoriesService.create(createTerritoryDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Territory),
  })
  async findAll(
    @Query() query: FindAllTerritoriesDto,
  ): Promise<InfinityPaginationResponseDto<Territory>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.territoriesService.findAllWithPagination({
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
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Territory,
  })
  findById(@Param('id') id: number) {
    return this.territoriesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Territory,
  })
  update(
    @Param('id') id: number,
    @Body() updateTerritoryDto: UpdateTerritoryDto,
  ) {
    return this.territoriesService.update(id, updateTerritoryDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.territoriesService.remove(id);
  }
}
