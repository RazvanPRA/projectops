import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { ApiErrorDto } from './dto/api-error.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logs in a user.' })
  @ApiBody({
    type: LoginDto,
    required: true,
    examples: {
      admin: {
        summary: 'Admin login',
        value: { email: 'admin@projectops.dev', password: 'Admin123!' },
      },
      viewer: {
        summary: 'Viewer login',
        value: { email: 'viewer@projectops.dev', password: 'Viewer123!' },
      },
    },
  })
  @ApiOkResponse({ description: 'successful login', type: LoginResponseDto })
  @ApiUnauthorizedResponse({
    description: 'invalid credentials',
    type: ApiErrorDto as never,
  })
  @ApiInternalServerErrorResponse({
    description: 'internal server error',
    type: ApiErrorDto as never,
  })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Returns the current authenticated user.' })
  @ApiOkResponse({ description: 'current user', type: MeResponseDto })
  @ApiUnauthorizedResponse({
    description: 'missing/invalid token',
    type: ApiErrorDto as never,
  })
  me(@Req() req: Request & { user: MeResponseDto }): MeResponseDto {
    return req.user;
  }
}
