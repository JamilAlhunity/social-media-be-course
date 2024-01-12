import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { relationSelectUser } from 'modules/users/constants/select-user.constant';
import { UsersService } from 'modules/users/users.service';
import { emptyRow } from 'shared/error-helpers/empty-row.helper';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import { checkArrayNullability } from 'shared/util/nullability.util';
import { Repository } from 'typeorm';
import {
  filterFeedPosts,
  filterPosts,
} from './constants/filter-posts.constant';
import {
  relationSelectPost,
  selectPost,
} from './constants/select-post.constant';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostsDto } from './dto/filter-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostMedia } from './entities/post-media.entity';
import { Post } from './entities/post.entity';
import { PostMediaType } from './enums/post-media-type.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    private readonly usersService: UsersService,

    @InjectRepository(PostMedia)
    private postMediasRepository: Repository<PostMedia>,
  ) { }
  async create(
    createPostDto: CreatePostDto,
    userID: string,
  ): Promise<ResponseFromServiceI<Post>> {
    const { images, videos, ...restOfCreatePostDto } = createPostDto;
    const user = await this.usersService.findOneByID(userID);

    if (!user)
      throw new HttpException(
        "can't create a post without a user",
        HttpStatus.NOT_FOUND,
      );

    const postToCreate = this.postsRepository.create(restOfCreatePostDto);
    postToCreate.author = user;

    const createdPost = await this.postsRepository.save(postToCreate);

    const imagesPromises: Promise<PostMedia>[] = [];
    const videosPromises: Promise<PostMedia>[] = [];
    if (checkArrayNullability(images)) {
      for (const image of images!) {
        const postMedia = this.postMediasRepository.create({
          media: image,
          post: createdPost,
          postMediaType: PostMediaType.IMAGE,
        });
        imagesPromises.push(this.postMediasRepository.save(postMedia));
      }
    }

    if (checkArrayNullability(videos)) {
      for (const video of videos!) {
        const postMedia = this.postMediasRepository.create({
          media: video,
          post: createdPost,
          postMediaType: PostMediaType.VIDEO,
        });
        videosPromises.push(this.postMediasRepository.save(postMedia));
      }
    }

    await Promise.all([...imagesPromises, ...videosPromises]);

    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.post' },
      },
      data: postToCreate,
    };
  }

  async findAll(
    filterPostsDto: FilterPostsDto,
    userID: string,
  ): Promise<ResponseFromServiceI<Post[]>> {
    const { skip, take, isAgeRestricted, username } = filterPostsDto;

    const posts = await this.postsRepository.find({
      relations: { author: true, postMedias: true },
      select: {
        ...relationSelectPost,

        author: relationSelectUser,
      },
      where: filterPosts(userID, isAgeRestricted, username),
      take,
      skip,
    });

    return {
      data: posts,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.post' },
      },
    };
  }

  async findOne(postID: string) {
    const post = await this.postsRepository.findOne({
      where: { id: postID },
      relations: { author: true },
      select: {
        ...relationSelectPost,

        author: relationSelectUser,
      },
    });
    if (!post) throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    return {
      data: post,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findOne',
        args: { entity: 'entities.post' },
      },
    };
  }

  async update(postID: string, updatePostDto: UpdatePostDto, userID: string) {
    const updateResult = await this.postsRepository
      .createQueryBuilder()
      .update(Post)
      .set(updatePostDto)
      .where('id = :id AND author = :userID', { id: postID, userID })
      .returning(selectPost as string[])
      .execute();

    if (!updateResult.affected)
      throw new HttpException('post not found', HttpStatus.NOT_FOUND);

    return {
      data: updateResult.raw[0],
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.post' },
      },
      httpStatus: HttpStatus.OK,
    };
  }

  async remove(postID: string, userID: string) {
    const deleteResult = await this.postsRepository
      .createQueryBuilder()
      .delete()
      .from(Post)
      .where('id = :id AND author = :userID', { id: postID, userID })
      .returning(selectPost as string[])
      .execute();

    if (!deleteResult.affected)
      throw new HttpException('post not found', HttpStatus.NOT_FOUND);

    return {
      data: deleteResult.raw[0],
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.post' },
      },
      httpStatus: HttpStatus.OK,
    };
  }

  async postsFeed(filterPostsDto: FilterPostsDto, userID: string) {
    const { skip, take, isAgeRestricted, username } = filterPostsDto;
    const user = await this.usersService.findOneWithOptions({
      relations: { followings: { follower: true } },
      where: { id: userID },
    });

    emptyRow(user, 'user');

    const followings =
      user?.followings.map((following) => following.follower.id) ?? [];

    const posts = await this.postsRepository.find({
      relations: { author: true, postMedias: true },
      select: {
        ...relationSelectPost,

        author: relationSelectUser,
      },
      where: filterFeedPosts(followings, isAgeRestricted, username),
      take,
      skip,
    });

    return {
      data: posts,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.post' },
      },
    };
  }

  findOneByID(postID: string) {
    return this.postsRepository.findOneBy({ id: postID });
  }
}
