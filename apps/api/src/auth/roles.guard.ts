import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

type AuthUser = { userId: string; email: string; role: string };
type AuthedRequest = Request & { user?: AuthUser };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!required || required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const user = req.user as { role?: string };

    if (!user?.role) throw new ForbiddenException('Missing user role');
    if (!required.includes(user.role))
      throw new ForbiddenException('Insufficient role');

    return true;
  }
}
