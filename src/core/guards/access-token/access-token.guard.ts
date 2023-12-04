import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'core/decorators/public.decorator';
import { CacheService } from 'core/lib/cache/cache.service';
import { DecodedTokenI } from 'shared/interfaces/decoded-token.interface';
import { RequestI } from 'shared/interfaces/request.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflect: Reflector,
    private readonly cacheService: CacheService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<RequestI>();

      const isPublic = this.reflect.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getClass(),
        context.getHandler(),
      ]);

      if (isPublic) return true;

      const authorization = request.headers.authorization;

      if (
        !authorization ||
        Array.isArray(authorization) ||
        typeof authorization !== 'string'
      )
        throw new HttpException('Invalid Headers', HttpStatus.UNAUTHORIZED);

      const [bearer, accessToken] = authorization.split(' ');

      if (bearer !== 'Bearer')
        throw new HttpException('Invalid Headers', HttpStatus.UNAUTHORIZED);

      const decodedToken = this.jwtService.verify<DecodedTokenI>(accessToken, {
        secret: '$0cI4lM3dI4ApPf0rN3$tJ$C0uR$3_AccessToken',
      });

      const { sub } = decodedToken;

      const userFromCache = await this.cacheService.get<{
        accessToken: string;
        userID: string;
      }>(sub + '');

      const isTokenFromCacheSameAsTokenFromHeaders =
        userFromCache?.accessToken === accessToken;

      if (!isTokenFromCacheSameAsTokenFromHeaders)
        throw new HttpException('Nice Try', HttpStatus.UNAUTHORIZED);

      request.user = decodedToken;
      return true;
    } catch (error: any) {
      throw new HttpException(
        !!error?.message ? error.message : 'You must be logged in first',
        !!error?.status ? error.status : HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
