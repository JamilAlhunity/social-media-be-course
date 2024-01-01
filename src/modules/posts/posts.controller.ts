import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserID } from 'core/decorators/user-id.decorator';
import { FilterPostsDto } from './dto/filter-posts.dto';
import { ROUTES } from 'shared/constants/routes.constant';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(ROUTES.POSTS.CONTROLLER)
@Controller(ROUTES.POSTS.CONTROLLER)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post(ROUTES.POSTS.CREATE)
  create(@Body() createPostDto: CreatePostDto, @UserID() userID: string) {
    return this.postsService.create(createPostDto, userID);
  }

  @Get(ROUTES.POSTS.FIND_ALL)
  findAll(@Query() filterPostsDto: FilterPostsDto) {
    return this.postsService.findAll(filterPostsDto);
  }

  @Get(ROUTES.POSTS.FIND_ONE)
  findOne(@Param('postID', new ParseUUIDPipe()) postID: string) {
    return this.postsService.findOne(postID);
  }

  @Patch(ROUTES.POSTS.UPDATE_ONE)
  update(
    @Param('postID', new ParseUUIDPipe()) postID: string,
    @Body() updatePostDto: UpdatePostDto,
    @UserID() userID: string,
  ) {
    return this.postsService.update(postID, updatePostDto, userID);
  }

  @Delete(ROUTES.POSTS.DELETE_ONE)
  remove(
    @Param('postID', new ParseUUIDPipe()) postID: string,
    @UserID() userID: string,
  ) {
    return this.postsService.remove(postID, userID);
  }
}
