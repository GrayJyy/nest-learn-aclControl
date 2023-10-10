import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoginDto } from './user/dto/login.dto';
import { Request } from 'express';

declare module 'express-session' {
  interface Session {
    user: Pick<LoginDto, 'username'>;
  }
}
@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const _request: Request = context.switchToHttp().getRequest();
    if (!_request.session?.user) throw new UnauthorizedException('用户未登录');
    return true;
  }
}
