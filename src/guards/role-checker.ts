import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleCheckerGuard implements CanActivate {
  constructor(@Inject() private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userType = this.reflector.get('user-type', context.getHandler());
    const loggedInUserType = context.switchToHttp().getRequest()?.user?.type;
    if (loggedInUserType !== userType) {
      throw new ForbiddenException('error: invalid user type');
    }
    return true;
  }
}
