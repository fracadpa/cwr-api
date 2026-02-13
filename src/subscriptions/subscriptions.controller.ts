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
  Req,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Subscription } from './domain/subscriptions';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllsubscriptionsDto } from './dto/find-all-subscriptions.dto';
import { Request } from 'express';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'subscriptions',
  version: '1',
})
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles(RoleEnum.admin)
  @ApiCreatedResponse({
    type: Subscription,
  })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @Roles(RoleEnum.admin)
  @ApiOkResponse({
    type: InfinityPaginationResponse(Subscription),
  })
  async findAll(
    @Query() query: FindAllsubscriptionsDto,
  ): Promise<InfinityPaginationResponseDto<Subscription>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.subscriptionsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get('my-history')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @ApiOkResponse({
    type: InfinityPaginationResponse(Subscription),
  })
  async findMySubscriptions(
    @Req() request: Request,
    @Query() query: FindAllsubscriptionsDto,
  ): Promise<InfinityPaginationResponseDto<Subscription>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const companyId = (request.user as any).companyId; // Assuming companyId is in the JWT payload

    return infinityPagination(
      await this.subscriptionsService.findAllByCompanyIdWithPagination({
        companyId,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @Roles(RoleEnum.admin)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Subscription,
  })
  findById(@Param('id') id: number) {
    return this.subscriptionsService.findById(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.admin)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Subscription,
  })
  update(
    @Param('id') id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.subscriptionsService.remove(id);
  }
}
