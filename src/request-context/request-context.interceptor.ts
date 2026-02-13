import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContextService } from './request-context.service';
import { FilterScope, TenantContext } from './request-context.interface';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { RoleEnum } from '../roles/roles.enum';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayloadType | undefined;

    // If no user (public endpoint), proceed without context
    if (!user) {
      return next.handle();
    }

    // Build tenant context from JWT payload
    const tenantContext: TenantContext = {
      tenantId: user.tenantId ?? null,
      companyId: user.companyId ?? null,
      userId: user.id,
      roleId: user.role?.id ?? RoleEnum.user,
    };

    // Determine filter scope based on role
    // Admin (role=1) bypasses all filtering
    // User (role=2) gets tenant+company filtering
    const filterScope =
      user.role?.id === RoleEnum.admin ? FilterScope.NONE : FilterScope.TENANT;

    // Run the handler within the async local storage context
    return new Observable((subscriber) => {
      RequestContextService.run({ tenantContext, filterScope }, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
