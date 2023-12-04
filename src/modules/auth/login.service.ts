import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CacheService } from 'core/lib/cache/cache.service';
import { UsersService } from 'modules/users/users.service';
import { LogUserInDto } from './dto/log-user-in.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}
  /**
   * Provided Email and Password
   *
   * If User Exist
   * Check Password using bcrypt, and I make sure that the checked password aligns with the given email
   *
   * action to show that the user logged
   */
  async logUserIn(logUserInDto: LogUserInDto) {
    const { email } = logUserInDto;

    const user = this.usersService.findUserByEmail(email);

    if (!user)
      throw new HttpException(
        'User Credentials is incorrect',
        HttpStatus.UNAUTHORIZED,
      );

    const { password } = user;
    const isPasswordCorrect = await bcrypt.compare(
      logUserInDto.password,
      password,
    );

    if (!isPasswordCorrect)
      throw new HttpException(
        'User Credentials is incorrect',
        HttpStatus.UNAUTHORIZED,
      );

    const payload = {
      sub: user.id,
    };

    const userFromCache = await this.cacheService.get<{
      accessToken: string;
      userID: string;
    }>(user.id + '');

    let accessToken = undefined;
    if (!userFromCache?.accessToken) {
      accessToken = this.jwtService.sign(payload, {
        secret: '$0cI4lM3dI4ApPf0rN3$tJ$C0uR$3_AccessToken',
        expiresIn: '1d',
      });

      await this.cacheService.set(
        user.id + '',
        {
          userID: user.id + '',
          accessToken,
        },
        0,
      );

      return { accessToken };
    }

    accessToken = userFromCache?.accessToken;

    return { accessToken };
  }
}
