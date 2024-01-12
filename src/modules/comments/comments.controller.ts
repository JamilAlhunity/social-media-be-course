import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ROUTES } from 'shared/constants/routes.constant';
import { ApiTags } from '@nestjs/swagger';
import { UserID } from 'core/decorators/user-id.decorator';

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

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
