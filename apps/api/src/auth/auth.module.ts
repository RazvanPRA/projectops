import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import type { StringValue } from 'ms';

function parseExpiresIn(value: string | undefined): number | StringValue {
  if (!value) return '15m';
  if (/^\d+$/.test(value)) return Number(value);

  return value as StringValue;
}

const secret = process.env.JWT_ACCESS_SECRET;
if (!secret) throw new Error('JWT_ACCESS_SECRET is not set (apps/api/.env)');

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: parseExpiresIn(process.env.JWT_ACCESS_EXPIRES_IN),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
