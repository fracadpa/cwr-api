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
import { ComposersService } from './composers.service';
import { CreateComposerDto } from './dto/create-composer.dto';
import { UpdateComposerDto } from './dto/update-composer.dto';
import { FindAllComposersDto } from './dto/find-all-composers.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@app/roles/roles.decorator';
import { RoleEnum } from '@app/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@app/roles/roles.guard';
import { infinityPagination } from '@app/utils/infinity-pagination';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Composers')
@Controller({
  path: 'composers',
  version: '1',
})
export class ComposersController {
  constructor(private readonly composersService: ComposersService) {}

  @Post()
  create(@Body() createPayload: CreateComposerDto) {
    return this.composersService.create(createPayload);
  }

  @Get()
  async findAll(@Query() query: FindAllComposersDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return infinityPagination(
      await this.composersService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.composersService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayload: UpdateComposerDto) {
    return this.composersService.update(+id, updatePayload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.composersService.remove(+id);
  }
}
