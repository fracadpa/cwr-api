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
import { PublisherAffiliationsService } from '@app/publisher-affiliations/publisher-affiliations.service';
import { CreatePublisherAffiliationDto } from '@app/publisher-affiliations/dto/create-publisher-affiliation.dto';
import { UpdatePublisherAffiliationDto } from '@app/publisher-affiliations/dto/update-publisher-affiliation.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '@app/roles/roles.guard';
import { Roles } from '@app/roles/roles.decorator';
import { RoleEnum } from '@app/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { infinityPagination } from '@app/utils/infinity-pagination';
import { FindAllPublisherAffiliationsDto } from '@app/publisher-affiliations/dto/find-all-publisher-affiliations.dto';
import { PublisherAffiliation } from '@app/publisher-affiliations/domain/publisher-affiliation';
import { InfinityPaginationResponse } from '@app/utils/dto/infinity-pagination-response.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Publisher Affiliations')
@Controller({
  path: 'publisher-affiliations',
  version: '1',
})
export class PublisherAffiliationsController {
  constructor(
    private readonly publisherAffiliationsService: PublisherAffiliationsService,
  ) {}

  @Post()
  create(@Body() createPublisherAffiliationDto: CreatePublisherAffiliationDto) {
    return this.publisherAffiliationsService.create(
      createPublisherAffiliationDto,
    );
  }

  @Get()
  async findAll(@Query() query: FindAllPublisherAffiliationsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return infinityPagination(
      await this.publisherAffiliationsService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get('publisher/:publisherId')
  @ApiParam({
    name: 'publisherId',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityPaginationResponse(PublisherAffiliation),
  })
  async findByPublisherId(
    @Param('publisherId') publisherId: number,
    @Query() query: FindAllPublisherAffiliationsDto,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return infinityPagination(
      await this.publisherAffiliationsService.findByPublisherId(publisherId, {
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publisherAffiliationsService.findOne({ id: +id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublisherAffiliationDto: UpdatePublisherAffiliationDto,
  ) {
    return this.publisherAffiliationsService.update(
      +id,
      updatePublisherAffiliationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publisherAffiliationsService.remove(+id);
  }
}
