import { AppConfigService } from '@/application/ports/app-config.service.js';
import type { Params } from 'nestjs-pino';

export const pinoConfig = (config: AppConfigService): Params => {
  return {
    pinoHttp: {
      name: config.appName,
      level: config.isTest ? 'silent' : config.logLevel,
      transport: config.isProduction
        ? undefined
        : { target: 'pino-pretty', options: { singleLine: true } },
    },
  };
};
