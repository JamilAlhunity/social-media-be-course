import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostsService } from 'modules/posts/posts.service';
import { UsersService } from 'modules/users/users.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  comments: Comment[] = [];
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  create(createCommentDto: CreateCommentDto, postID: number) {
    const { author, replyToComment, text } = createCommentDto;

    const user = this.usersService.findOne(author);

    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    const post = this.postsService.findOne(postID);
    if (!post)
      throw new HttpException('post not found', HttpStatus.BAD_REQUEST);
    let length = this.comments.length;

    const comment = new Comment(text, user, post, length++);

    let originalComment = undefined;
    if (!!replyToComment) {
      originalComment = this.findOne(replyToComment);
      if (!originalComment)
        throw new HttpException(
          'Comment you are replying to was not found',
          HttpStatus.BAD_REQUEST,
        );
      originalComment.addReply(comment);
      comment.reply(originalComment);
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created Comment Successfully',
    };
  }

  findOne(id: number) {
    return this.comments.find((comment) => comment.id === id);
  }
}
