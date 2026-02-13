import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ComposerAffiliationsService } from './composer-affiliations.service';
import { CreateComposerAffiliationDto } from './dto/create-composer-affiliation.dto';
import { UpdateComposerAffiliationDto } from './dto/update-composer-affiliation.dto';
import { FindAllComposerAffiliationsDto } from './dto/find-all-composer-affiliations.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@app/roles/roles.decorator';
import { RoleEnum } from '@app/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@app/roles/roles.guard';
import { infinityPagination } from '@app/utils/infinity-pagination';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Composer Affiliations')
@Controller({
  path: 'composer-affiliations',
  version: '1',
})
export class ComposerAffiliationsController {
  constructor(
    private readonly composerAffiliationsService: ComposerAffiliationsService,
  ) {}

  @Post()
  create(@Body() createPayload: CreateComposerAffiliationDto) {
    return this.composerAffiliationsService.create(createPayload);
  }

  @Get()
  async findAll(@Query() query: FindAllComposerAffiliationsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return infinityPagination(
      await this.composerAffiliationsService.findManyWithPagination(
        {
          page,
          limit,
        },
        {
          composerId: query.composerId,
        },
      ),
      { page, limit },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.composerAffiliationsService.findOne({ id: +id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePayload: UpdateComposerAffiliationDto,
  ) {
    return this.composerAffiliationsService.update(+id, updatePayload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.composerAffiliationsService.remove(+id);
  }
}
