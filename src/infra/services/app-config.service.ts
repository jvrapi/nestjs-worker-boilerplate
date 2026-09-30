import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/application/ports/app-config.js';
import { Env } from '../configs/env.schema.js';

@Injectable()
export class AppConfigService extends AppConfig {
  constructor(private readonly config: ConfigService<Env, true>) {
    super();
  }

  // Leitura tipada para uso interno da infra (pino, main.ts etc.)
  get<K extends keyof Env>(key: K): Env[K] {
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
}
