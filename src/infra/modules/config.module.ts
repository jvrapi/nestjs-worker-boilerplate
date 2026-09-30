import { Global, Module } from '@nestjs/common';
import { AppConfig } from '@/application/ports/app-config.js';
import { AppConfigService } from '../services/app-config.service.js';

@Global()
@Module({
  providers: [
    AppConfigService,
    { provide: AppConfig, useExisting: AppConfigService },
  ],
  exports: [AppConfigService, AppConfig],
})
export class AppConfigModule {}
