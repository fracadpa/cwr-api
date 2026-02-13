import { Session } from '../../../session/domain/session';
import { User } from '../../../users/domain/user';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  sessionId: Session['id'];
  tenantId?: number | string;
  companyId?: number | string;
  activeSubscriptionId?: number | string;
  iat: number;
  exp: number;
};
