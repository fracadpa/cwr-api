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
import { IpCapacitiesService } from './ip-capacities.service';
import { CreateIpCapacityDto } from './dto/create-ip-capacity.dto';
import { UpdateIpCapacityDto } from './dto/update-ip-capacity.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { IpCapacity } from './domain/ip-capacity';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllIpCapacitiesDto } from './dto/find-all-ip-capacities.dto';

@ApiTags('IpCapacities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'ip-capacities',
  version: '1',
})
export class IpCapacitiesController {
  constructor(private readonly ipCapacitiesService: IpCapacitiesService) {}

  @Post()
  @ApiCreatedResponse({
    type: IpCapacity,
  })
  create(@Body() createIpCapacityDto: CreateIpCapacityDto) {
    return this.ipCapacitiesService.create(createIpCapacityDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(IpCapacity),
  })
  async findAll(
    @Query() query: FindAllIpCapacitiesDto,
  ): Promise<InfinityPaginationResponseDto<IpCapacity>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.ipCapacitiesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
        search: query.search,
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
    type: IpCapacity,
  })
  findById(@Param('id') id: number) {
    return this.ipCapacitiesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: IpCapacity,
  })
  update(
    @Param('id') id: number,
    @Body() updateIpCapacityDto: UpdateIpCapacityDto,
  ) {
    return this.ipCapacitiesService.update(id, updateIpCapacityDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.ipCapacitiesService.remove(id);
  }
}
