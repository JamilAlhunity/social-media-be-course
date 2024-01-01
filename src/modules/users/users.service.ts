import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'core/lib/cache/cache.service';
import { DynamicObjectI } from 'shared/interfaces/general/dynamic-object.interface';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import { checkNullability } from 'shared/util/nullability.util';
import {
  Equal,
  FindOptionsSelect,
  ILike,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { selectUser } from './constants/select-user.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Follower } from './entities/follower.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly cacheService: CacheService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Follower)
    private followersRepository: Repository<Follower>,
  ) {}

  async createUserForAuth(createUserDto: CreateUserDto) {
    const createdUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(createdUser);

    return createdUser;
  }

  async findAll(
    filterUsersDto: FilterUsersDto,
  ): Promise<ResponseFromServiceI<User[]>> {
    const { skip, take, email, username } = filterUsersDto;

    const filterObject: DynamicObjectI = {};
    !checkNullability(email)
      ? (filterObject['email'] = Not(IsNull()))
      : (filterObject['email'] = ILike(`%${email}%`));
    !checkNullability(username)
      ? (filterObject['username'] = Not(IsNull()))
      : (filterObject['username'] = ILike(`%${username}%`));

    const users = await this.usersRepository.find({
      relations: { followers: true, followings: true },
      select: selectUser as FindOptionsSelect<User>,
      where: [filterObject],
      take,
      skip,
    });
    return {
      data: users,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.user' },
      },
    };
  }

  async findOne(userID: string): Promise<ResponseFromServiceI<User>> {
    const user = await this.usersRepository.findOne({
      where: { id: userID },
      select: selectUser as FindOptionsSelect<User>,
    });
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

  async update(
    userID: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseFromServiceI<User>> {
    const updateResult = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id: userID })
      .returning(selectUser as string[])
      .execute();

    if (!updateResult.affected)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    return {
      data: updateResult.raw[0],
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.user' },
      },
      httpStatus: HttpStatus.OK,
    };
  }

  async remove(userID: string): Promise<ResponseFromServiceI<number>> {
    const deleteResult = await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id: userID })
      .returning(selectUser as string[])
      .execute();

    if (!deleteResult.affected)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    this.cacheService.del(userID + '');

    return {
      data: deleteResult.raw[0],
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.user' },
      },
      httpStatus: HttpStatus.OK,
    };
  }

  async followUnfollow(
    userToPerformActionOnID: string,
    loggedInUserID: string,
  ) {
    const [loggedInUser, userToPerformActionOn] = await Promise.all([
      this.findOneByID(loggedInUserID),
      this.findOneByID(userToPerformActionOnID),
    ]);

    if (!loggedInUser)
      throw new HttpException(
        'Logged in user does not exist',
        HttpStatus.NOT_FOUND,
      );
    if (!userToPerformActionOn)
      throw new HttpException(
        'User To Perform Action On in user does not exist',
        HttpStatus.NOT_FOUND,
      );

    const follower = await this.followersRepository.findOne({
      relations: { author: true, following: true },
      where: {
        author: Equal(loggedInUserID),
        following: Equal(userToPerformActionOnID),
      },
    });

    if (!follower) {
      const followerToCreate = this.followersRepository.create({
        author: loggedInUser,
        following: userToPerformActionOn,
      });
      const createdFollower =
        await this.followersRepository.save(followerToCreate);

      return {
        data: createdFollower,
        message: {
          translationKey: 'shared.success.update',
          args: { entity: 'entities.user' },
        },
        httpStatus: HttpStatus.OK,
      };
    } else {
      const deleteResult = await this.followersRepository.delete({
        author: loggedInUser,
        following: userToPerformActionOn,
      });

      if (!deleteResult.affected)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      return {
        data: deleteResult.raw[0],
        message: {
          translationKey: 'shared.success.delete',
          args: { entity: 'entities.user' },
        },
        httpStatus: HttpStatus.OK,
      };
    }
  }

  findOneByID(userID: string) {
    return this.usersRepository.findOneBy({ id: userID });
  }

  findUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findUserByColumn(column: string, value: unknown) {
    return this.usersRepository.findOneBy({ [column]: value });
  }
}
