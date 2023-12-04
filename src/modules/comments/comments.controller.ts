import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postID')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postID', ParseIntPipe) postID: number,
  ) {
    return this.commentsService.create(createCommentDto, postID);
  }
}
