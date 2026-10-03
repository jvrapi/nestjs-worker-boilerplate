import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health.module.js';
import { pinoConfig } from '../configs/pino.config.js';
import { validateEnv } from '../configs/schemas/envs/env.schema.js';

import { AppConfigModule } from './config.module.js';
import { AppConfigService } from '@/application/ports/app-config.service.js';

@Module({
  imports: [
    HealthModule,
    AppConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      validate: validateEnv,
    }),
    LoggerModule.forRootAsync({
      useFactory: pinoConfig,
      inject: [AppConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
