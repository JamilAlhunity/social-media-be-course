import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from 'modules/posts/posts.service';
import { UsersService } from 'modules/users/users.service';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService
  ) { }

  async create(createCommentDto: CreateCommentDto, postID: string, userID: string): Promise<ResponseFromServiceI<Comment>> {
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

    const createdComment = this.commentsRepository.create(createCommentDto)
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

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, _updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
