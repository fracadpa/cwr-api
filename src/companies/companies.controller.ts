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
import { CompaniesService } from './companies.service'; // Corrected import
import { CreateCompanyDto } from './dto/create-company.dto'; // Corrected import
import { UpdateCompanyDto } from './dto/update-company.dto'; // Corrected import
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Company } from './domain/companies'; // Corrected import
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllcompaniesDto } from './dto/find-all-companies.dto';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'companies',
  version: '1',
})
export class CompaniesController {
  // Corrected class name
  constructor(private readonly companiesService: CompaniesService) {} // Corrected class name

  @Post()
  @ApiCreatedResponse({
    type: Company,
  })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    // Corrected DTO
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Company),
  })
  async findAll(
    @Query() query: FindAllcompaniesDto,
  ): Promise<InfinityPaginationResponseDto<Company>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.companiesService.findAllWithPagination({
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
    type: Company,
  })
  findById(@Param('id') id: number) {
    return this.companiesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Company,
  })
  update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto, // Corrected DTO
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.companiesService.remove(id);
  }
}
