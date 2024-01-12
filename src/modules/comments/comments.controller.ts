import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ROUTES } from 'shared/constants/routes.constant';
import { ApiTags } from '@nestjs/swagger';
import { UserID } from 'core/decorators/user-id.decorator';
import { FilterCommentsDto } from './dto/filter-comment.dto';

@ApiTags(ROUTES.COMMENTS.CONTROLLER)
@Controller(ROUTES.COMMENTS.CONTROLLER)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post(ROUTES.COMMENTS.CREATE)
  create(
    @Param('postID', new ParseUUIDPipe()) postID: string,
    @Body() createCommentDto: CreateCommentDto,
    @UserID() userID: string,
  ) {
    return this.commentsService.create(createCommentDto, postID, userID);
  }

  @Get(ROUTES.COMMENTS.FIND_ALL_FROM_POST)
  findAllFromPost(
    @Param('postID', new ParseUUIDPipe()) postID: string,
    @Query() filterCommentsDto: FilterCommentsDto,
  ) {
    return this.commentsService.findAllFromPost(postID, filterCommentsDto);
  }


  @Patch(ROUTES.COMMENTS.UPDATE_ONE)
  update(
    @Param('commentID', new ParseUUIDPipe()) commentID: string,
    @UserID() userID: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(commentID, userID, updateCommentDto);
  }

  @Delete(ROUTES.COMMENTS.DELETE_ONE)
  remove(
    @Param('commentID', new ParseUUIDPipe()) commentID: string,
    @UserID() userID: string,
  ) {
    return this.commentsService.remove(commentID, userID);
  }
}
