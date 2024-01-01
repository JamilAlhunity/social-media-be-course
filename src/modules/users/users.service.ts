import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'core/lib/cache/cache.service';
import { emptyRow } from 'shared/error-helpers/empty-row.helper';
import { DynamicObjectI } from 'shared/interfaces/general/dynamic-object.interface';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import { checkNullability } from 'shared/util/nullability.util';
import {
  Equal,
  FindOneOptions,
  FindOptionsSelect,
  ILike,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import {
  relationSelectUser,
  selectUser,
  selectUsers,
} from './constants/select-user.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Follower } from './entities/follower.entity';
import { Following } from './entities/following.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly cacheService: CacheService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Follower)
    private followersRepository: Repository<Follower>,

    @InjectRepository(Following)
    private followingsRepository: Repository<Following>,
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
      select: selectUsers as FindOptionsSelect<User>,
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
      relations: {
        posts: { postMedias: true },
        followers: true,
        followings: true,
      },
      where: { id: userID },
      select: selectUser,
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
      .returning(selectUsers as string[])
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
      .returning(selectUsers as string[])
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
    userIDToPerformActionOn: string,
    loggedInUserID: string,
  ): Promise<ResponseFromServiceI<User>> {
    const [loggedInUser, userToPerformActionOn] = await Promise.all([
      this.findOneByID(loggedInUserID),
      this.findOneByID(userIDToPerformActionOn),
    ]);

    emptyRow(loggedInUser, 'user');
    emptyRow(userToPerformActionOn, 'user');

    const follower = await this.followersRepository.findOne({
      relations: { author: true, following: true },
      where: {
        author: Equal(userIDToPerformActionOn),
        following: Equal(loggedInUserID),
      },
    });

    const shouldFollow = !follower;

    if (shouldFollow) {
      this.follow(loggedInUser!, userToPerformActionOn!);
      return {
        data: userToPerformActionOn!,
        message: {
          translationKey: 'shared.success.update',
          args: { entity: 'entities.user' },
        },
        httpStatus: HttpStatus.OK,
      };
    } else {
      await this.unfollow(follower.id, loggedInUser!, userToPerformActionOn!);

      return {
        data: userToPerformActionOn!,
        message: {
          translationKey: 'shared.success.delete',
          args: { entity: 'entities.user' },
        },
        httpStatus: HttpStatus.OK,
      };
    }
  }

  async unfollow(
    followerID: string,
    loggedInUser: User,
    userToPerformActionOn: User,
  ) {
    const [deleteResult, _] = await Promise.all([
      this.followersRepository
        .createQueryBuilder()
        .delete()
        .from(Follower)
        .where('id = :id', { id: followerID })
        .execute(),
      this.followingsRepository
        .createQueryBuilder()
        .delete()
        .from(Following)
        .where('author = :authorID AND follower = :followerID', {
          authorID: loggedInUser.id,
          followerID: userToPerformActionOn.id,
        })
        .execute(),
    ]);

    if (!deleteResult.affected)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
  }

  async follow(loggedInUser: User, userToPerformActionOn: User) {
    const followerToCreate = this.followersRepository.create({
      author: userToPerformActionOn,
      following: loggedInUser,
    });

    const followingToCreate = this.followingsRepository.create({
      author: loggedInUser,
      follower: userToPerformActionOn,
    });

    await Promise.all([
      this.followersRepository.save(followerToCreate),
      this.followingsRepository.save(followingToCreate),
    ]);
  }

  async findFollowers(
    userIDToView: string,
  ): Promise<ResponseFromServiceI<Follower[]>> {
    const followers = await this.followersRepository.find({
      relations: { following: true },
      where: { author: Equal(userIDToView) },
      select: { following: relationSelectUser, id: true },
    });
    return {
      data: followers,
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.user' },
      },
      httpStatus: HttpStatus.OK,
    };
  }
  async findFollowings(
    userIDToView: string,
  ): Promise<ResponseFromServiceI<Following[]>> {
    const followings = await this.followingsRepository.find({
      relations: { follower: true },
      where: { author: Equal(userIDToView) },
      select: { follower: relationSelectUser },
    });
    return {
      data: followings,
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.user' },
      },
      httpStatus: HttpStatus.OK,
    };
  }

  findOneByID(userID: string) {
    return this.usersRepository.findOneBy({ id: userID });
  }

  findOneWithOptions(options: FindOneOptions<User>) {
    return this.usersRepository.findOne(options);
  }

  findUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findUserByColumn(column: string, value: unknown) {
    return this.usersRepository.findOneBy({ [column]: value });
  }
}
