import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthUser } from './types/auth-user';

class LoginResponseDto {
  accessToken!: string;
}

class MeDto {
  userId!: string;
  email!: string;
  role!: 'admin' | 'viewer';
}

class RegisterUserDto {
  id!: string;
  email!: string;
  name!: string;
  role!: 'admin' | 'viewer';
  createdAt!: Date;
  updatedAt!: Date;
}

class RegisterResponseDto {
  user!: RegisterUserDto;
  accessToken!: string;
}

type AuthedRequest = Request & { user: AuthUser };

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user and return access token' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  @ApiConflictResponse({ description: 'Email already exists' })
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.name, dto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: MeDto })
  me(@Req() req: AuthedRequest): AuthUser {
    return req.user;
  }
}
