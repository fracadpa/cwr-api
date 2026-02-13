import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestContextService } from './request-context.service';
import { TenantContextInterceptor } from './request-context.interceptor';

@Global()
@Module({
  providers: [
    RequestContextService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantContextInterceptor,
    },
  ],
  exports: [RequestContextService],
})
export class RequestContextModule {}
