import type { Params } from 'nestjs-pino';
import { AppConfigService } from '../services/app-config.service.js';

export const pinoConfig = (config: AppConfigService): Params => {
  return {
    pinoHttp: {
      name: config.appName,
      level: config.isTest ? 'silent' : config.get('LOG_LEVEL'),
      transport: config.isProduction
        ? undefined
        : { target: 'pino-pretty', options: { singleLine: true } },
    },
  };
};
