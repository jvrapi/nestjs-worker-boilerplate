import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfigService as Port } from '@/application/ports/app-config.service.js';
import { Env } from '@/infra/configs/schemas/envs/env.schema.js';

@Injectable()
export class AppConfigService implements Port {
  constructor(private readonly config: ConfigService<Env, true>) {}

  private get<K extends keyof Env>(key: K): Env[K] {
    return this.config.get(key, { infer: true });
  }

  get appName(): string {
    return this.get('APP_NAME');
  }

  get isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }

  get isTest(): boolean {
    return this.get('NODE_ENV') === 'test';
  }

  get port(): number {
    return this.get('PORT');
  }

  get logLevel(): string {
    return this.get('LOG_LEVEL');
  }
}
