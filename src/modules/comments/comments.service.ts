import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from 'modules/posts/posts.service';
import { UsersService } from 'modules/users/users.service';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import { FilterCommentsDto } from './dto/filter-comment.dto';
import { relationSelectUser } from 'modules/users/constants/select-user.constant';
import { relationSelectComment, selectComment } from './constants/select-comment.constant';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) { }

  async create(
    createCommentDto: CreateCommentDto,
    postID: string,
    userID: string,
  ): Promise<ResponseFromServiceI<Comment>> {
    const post = await this.postsService.findOneByID(postID);
    const user = await this.usersService.findOneByID(userID);

    if (!user)
      throw new HttpException(
        "can't create a comment without a user",
        HttpStatus.NOT_FOUND,
      );

    if (!post)
      throw new HttpException(
        "can't create a comment without a post",
        HttpStatus.NOT_FOUND,
      );

    const createdComment = this.commentsRepository.create(createCommentDto);
    createdComment.author = user;
    createdComment.post = post;
    await this.commentsRepository.save(createdComment);
    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.comment' },
      },
      data: createdComment,
    };
  }

  async findAllFromPost(
    postID: string,
    { skip, take }: FilterCommentsDto,
  ): Promise<
    ResponseFromServiceI<{
      comments: Comment[];
      postCommentsTotalCount: number;
    }>
  > {
    const [comments, postCommentsTotalCount] = await Promise.all([
      this.commentsRepository.find({
        where: {
          post: {
            id: postID,
          },
        },
        relations: { author: true },
        select: {
          ...relationSelectComment,
          author: relationSelectUser,
        },
        take,
        skip,
      }),
      this.commentsRepository.count({
        where: {
          post: {
            id: postID,
          },
        },
      }),
    ]);

    return {
      data: { comments, postCommentsTotalCount },
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.comment' },
      },
    };
  }


  async update(
    commentID: string,
    userID: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<ResponseFromServiceI<Comment[]>> {
    const updateResult = await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set(updateCommentDto)
      .where('id = :id AND author = :userID', { id: commentID, userID })
      .returning(selectComment as string[])
      .execute();

    if (!updateResult.affected)
      throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

    return {
      data: updateResult.raw[0],
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.comment' },
      },
    };
  }

  async remove(
    commentID: string,
    userID: string,
  ): Promise<ResponseFromServiceI<Comment[]>> {
    const deleteResult = await this.commentsRepository
      .createQueryBuilder()
      .delete()
      .from(Comment)
      .where('id = :id AND author = :userID', { id: commentID, userID })
      .returning(selectComment as string[])
      .execute();

    if (!deleteResult.affected)
      throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

    return {
      data: deleteResult.raw[0],
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.comment' },
      },
      httpStatus: HttpStatus.OK,
    };
  }
}
