import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/core/decorators/public.decorator';
import { DecodedTokenI } from 'src/shared/interfaces/decoded-token.interface';
import { RequestI } from 'src/shared/interfaces/request.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflect: Reflector,
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

      request.user = decodedToken;
      return true;
    } catch (error) {
      throw new HttpException(
        !!error?.message ? error.message : 'You must be logged in first',
        !!error?.status ? error.status : HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
