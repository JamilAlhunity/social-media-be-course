import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CacheService } from 'core/lib/cache/cache.service';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly cacheService: CacheService) {}
  users: User[] = [];

  createUserForAuth(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const user = this.findUserByEmail(email);

    if (!!user)
      throw new HttpException(
        'Email already exists, please choose another one',
        HttpStatus.CONFLICT,
      );

    let length = this.users.length;

    const createdUser = new User({
      ...createUserDto,
      id: length++,
    });
    this.users.push(createdUser);

    return createdUser;
  }

  findAll(): ResponseFromServiceI<User[]> {
    return {
      data: this.users,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.user' },
      },
    };
  }

  findOne(id: number): ResponseFromServiceI<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return {
      data: user,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findOne',
        args: { entity: 'entities.user' },
      },
    };
  }

  update(id: number, updateUserDto: UpdateUserDto): ResponseFromServiceI<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    user.updateOne(updateUserDto);
    return {
      data: user,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.user' },
      },
      httpStatus: HttpStatus.OK,
    };
  }

  remove(id: number): ResponseFromServiceI<User> {
    let userToDeleteIndex = -1;
    this.users.find((user, index) => {
      if (user.id === id) {
        userToDeleteIndex = index;
      }
    });
    if (userToDeleteIndex === -1)
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    const deletedUser = this.users.splice(userToDeleteIndex, 1)[0];
    this.cacheService.del(deletedUser.id + '');
    return {
      data: deletedUser,
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.user' },
      },
      httpStatus: HttpStatus.OK,
    };
  }

  findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
