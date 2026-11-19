import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

/**
 * EXAMPLE MODULE (already done). Copy this shape for your own modules:
 * controller (HTTP) → service (logic) → test.
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Is the API up? Also checks the database.' })
  check() {
    return this.health.check();
  }
}
