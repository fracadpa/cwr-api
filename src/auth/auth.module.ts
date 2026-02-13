import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MailModule } from '../mail/mail.module';
import { SessionModule } from '../session/session.module';
import { UsersModule } from '../users/users.module';

import { CompaniesModule } from '../companies/companies.module'; // Import CompaniesModule
import { TenantsModule } from '../tenants/tenants.module'; // Import TenantsModule
import { SubscriptionsModule } from '../subscriptions/subscriptions.module'; // Import SubscriptionsModule
import { PlansModule } from '../plans/plans.module'; // Import PlansModule

@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
    CompaniesModule, // Added CompaniesModule
    TenantsModule, // Added TenantsModule
    SubscriptionsModule, // Added SubscriptionsModule
    PlansModule, // Added PlansModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
  exports: [AuthService],
})
export class AuthModule {}
