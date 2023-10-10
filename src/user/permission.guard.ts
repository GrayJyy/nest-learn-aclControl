import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const _username = (context.switchToHttp().getRequest() as Request).session
      .user.username;
    let _permissionsInRedis = await this.redisService.listGet(
      `user_${_username}_permissions`,
    );

    if (_permissionsInRedis.length === 0) {
      const _foundedUser = await this.userService.findByUsername(_username);
      _permissionsInRedis = _foundedUser.permissions.map((i) => i.name);
      await this.redisService.listSet(
        `user_${_username}_permissions`,
        _permissionsInRedis,
        60 * 30,
      );
    }
    const _permission = this.reflector.get('permission', context.getHandler());
    if (_permissionsInRedis.some((i) => i === _permission)) return true;
    throw new UnauthorizedException('无权限访问该接口');
  }
}
