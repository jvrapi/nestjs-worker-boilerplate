import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    // No template fica vazio. Cada projeto adiciona seus indicadores,
    // por exemplo: () => this.db.pingCheck('database')
    return this.health.check([]);
  }
}
