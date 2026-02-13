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
import { TenantsService } from './tenants.service'; // Corrected
import { CreateTenantDto } from './dto/create-tenant.dto'; // Corrected
import { UpdateTenantDto } from './dto/update-tenant.dto'; // Corrected
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Tenant } from './domain/tenants'; // Corrected
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAlltenantsDto } from './dto/find-all-tenants.dto';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'tenants',
  version: '1',
})
export class TenantsController {
  // Corrected
  constructor(private readonly tenantsService: TenantsService) {} // Corrected

  @Post()
  @ApiCreatedResponse({
    type: Tenant,
  })
  create(@Body() createTenantDto: CreateTenantDto) {
    // Corrected
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Tenant),
  })
  async findAll(
    @Query() query: FindAlltenantsDto,
  ): Promise<InfinityPaginationResponseDto<Tenant>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.tenantsService.findAllWithPagination({
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
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Tenant,
  })
  findById(@Param('id') id: string) {
    return this.tenantsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Tenant,
  })
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    // Corrected
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
