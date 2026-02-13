import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import {
  FilterScope,
  RequestContextData,
  TenantContext,
} from './request-context.interface';

@Injectable()
export class RequestContextService {
  private static storage = new AsyncLocalStorage<RequestContextData>();

  static run<T>(context: RequestContextData, fn: () => T): T {
    return this.storage.run(context, fn);
  }

  static getContext(): RequestContextData | undefined {
    return this.storage.getStore();
  }

  static getTenantContext(): TenantContext | undefined {
    return this.storage.getStore()?.tenantContext;
  }

  static getTenantId(): number | string | null {
    return this.storage.getStore()?.tenantContext?.tenantId ?? null;
  }

  static getCompanyId(): number | string | null {
    return this.storage.getStore()?.tenantContext?.companyId ?? null;
  }

  static getUserId(): number | string | undefined {
    return this.storage.getStore()?.tenantContext?.userId;
  }

  static getRoleId(): number | string | undefined {
    return this.storage.getStore()?.tenantContext?.roleId;
  }

  static getFilterScope(): FilterScope {
    return this.storage.getStore()?.filterScope ?? FilterScope.NONE;
  }

  static isAdmin(): boolean {
    return this.getFilterScope() === FilterScope.NONE;
  }
}
