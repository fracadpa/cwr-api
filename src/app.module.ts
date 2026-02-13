import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { DatabaseConfig } from './database/config/database-config.type';

// <database-block>
const infrastructureDatabaseModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    })
  : TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    });
// </database-block>

import { CompaniesModule } from './companies/companies.module'; // Corrected

import { TenantsModule } from './tenants/tenants.module'; // Corrected

import { PlansModule } from './plans/plans.module'; // Corrected

import { SubscriptionsModule } from './subscriptions/subscriptions.module'; // Corrected

import { ArtworksModule } from './artworks/artworks.module';

import { SocietiesModule } from './societies/societies.module';

import { IpCapacitiesModule } from './ip-capacities/ip-capacities.module';

import { TerritoriesModule } from './territories/territories.module';

import { PublishersModule } from './publishers/publishers.module';
import { PublisherAffiliationsModule } from './publisher-affiliations/publisher-affiliations.module';

import { PublisherAffiliationTerritoriesModule } from './publisher-affiliation-territories/publisher-affiliation-territories.module';

import { ComposersModule } from './composers/composers.module';

import { ComposerAffiliationsModule } from './composer-affiliations/composer-affiliations.module';
import { RequestContextModule } from './request-context/request-context.module';

@Module({
  imports: [
    RequestContextModule,
    ComposerAffiliationsModule,
    ComposersModule,
    PublisherAffiliationTerritoriesModule,
    PublisherAffiliationsModule,
    PublishersModule,
    TerritoriesModule,
    IpCapacitiesModule,
    SocietiesModule,
    ArtworksModule,
    SubscriptionsModule, // Corrected
    PlansModule, // Corrected
    TenantsModule, // Corrected
    CompaniesModule, // Corrected
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
  ],
})
export class AppModule {}
