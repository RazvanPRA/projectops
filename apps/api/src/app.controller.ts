import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { HealthResponse } from '@projectops/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
 @Get('health')
  health(): HealthResponse {
    return { status: 'ok' };
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
