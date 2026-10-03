import { Global, Module } from '@nestjs/common';
import { AppConfigService as Port } from '@/application/ports/app-config.service.js';
import { AppConfigService } from '../services/config/app-config.service.js';

@Global()
@Module({
  providers: [
    AppConfigService,
    { provide: Port, useExisting: AppConfigService },
  ],
  exports: [Port],
})
export class AppConfigModule {}
