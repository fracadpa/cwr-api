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
import { PublisherAffiliationTerritoriesService } from './publisher-affiliation-territories.service';
import { CreatePublisherAffiliationTerritoryDto } from './dto/create-publisher-affiliation-territory.dto';
import { UpdatePublisherAffiliationTerritoryDto } from './dto/update-publisher-affiliation-territory.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@app/roles/roles.guard';
import { Roles } from '@app/roles/roles.decorator';
import { RoleEnum } from '@app/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { infinityPagination } from '@app/utils/infinity-pagination';
import { FindAllPublisherAffiliationTerritoriesDto } from './dto/find-all-publisher-affiliation-territories.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Publisher Affiliation Territories')
@Controller({
  path: 'publisher-affiliation-territories',
  version: '1',
})
export class PublisherAffiliationTerritoriesController {
  constructor(
    private readonly publisherAffiliationTerritoriesService: PublisherAffiliationTerritoriesService,
  ) {}

  @Post()
  create(@Body() createPayload: CreatePublisherAffiliationTerritoryDto) {
    return this.publisherAffiliationTerritoriesService.create(createPayload);
  }

  @Get()
  async findAll(@Query() query: FindAllPublisherAffiliationTerritoriesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return infinityPagination(
      await this.publisherAffiliationTerritoriesService.findManyWithPagination(
        {
          page,
          limit,
        },
        {
          publisherId: query.publisherId,
        },
      ),
      { page, limit },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publisherAffiliationTerritoriesService.findOne({ id: +id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePayload: UpdatePublisherAffiliationTerritoryDto,
  ) {
    return this.publisherAffiliationTerritoriesService.update(
      +id,
      updatePayload,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publisherAffiliationTerritoriesService.remove(+id);
  }
}
