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
import { SocietiesService } from './societies.service';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Society } from './domain/society';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSocietiesDto } from './dto/find-all-societies.dto';

@ApiTags('Societies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'societies',
  version: '1',
})
export class SocietiesController {
  constructor(private readonly societiesService: SocietiesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Society,
  })
  create(@Body() createSocietyDto: CreateSocietyDto) {
    return this.societiesService.create(createSocietyDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Society),
  })
  async findAll(
    @Query() query: FindAllSocietiesDto,
  ): Promise<InfinityPaginationResponseDto<Society>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.societiesService.findAllWithPagination({
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
    type: Society,
  })
  findById(@Param('id') id: number) {
    return this.societiesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Society,
  })
  update(@Param('id') id: number, @Body() updateSocietyDto: UpdateSocietyDto) {
    return this.societiesService.update(id, updateSocietyDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.societiesService.remove(id);
  }
}
