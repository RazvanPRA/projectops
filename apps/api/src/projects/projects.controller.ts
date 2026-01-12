import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

interface ListQueryDto {
  page?: number;
  pageSize?: number;
  status?: 'active' | 'paused' | 'completed';
  q?: string;
}

@ApiTags('projects')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'paused', 'completed'],
    example: 'active',
  })
  @ApiQuery({ name: 'q', required: false, example: 'workspace' })
  list(@Query() query: ListQueryDto) {
    return { ok: true, query };
  }
}
