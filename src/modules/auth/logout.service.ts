import { Injectable, HttpStatus } from '@nestjs/common';
import { CacheService } from 'core/lib/cache/cache.service';
import { User } from 'modules/users/entities/user.entity';
import { UsersService } from 'modules/users/users.service';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';

@Injectable()
export class LogoutService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly userService: UsersService,
  ) {}

  async logUserOut(id: number): Promise<ResponseFromServiceI<User>> {
    await this.cacheService.deleteField(id + '', 'accessToken');
    const loggedOutUser = this.userService.findOne(id).data;
    return {
      message: 'auth.success.logout',
      httpStatus: HttpStatus.OK,
      data: loggedOutUser,
    };
  }
}
