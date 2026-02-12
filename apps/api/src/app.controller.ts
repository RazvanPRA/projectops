import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

class HealthDto {
  status!: 'ok';
}

@Controller()
@ApiTags('system')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOkResponse({ type: HealthDto })
  health(): HealthDto {
    return { status: 'ok' };
  }

  @Get('health/db')
  @ApiOkResponse({ type: HealthDto })
  async healthDb() {
    await this.prisma.user.findFirst();
    return { status: 'ok' };
  }
}
