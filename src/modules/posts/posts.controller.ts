import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsServiceI } from './interfaces/post-service.interface';
import { POST_SERVICE_PROVIDER } from './providers/post-service.provider';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(POST_SERVICE_PROVIDER) private readonly postsService: PostsServiceI,
  ) {}

  @Post(':authorID')
  create(
    @Body() createPostDto: CreatePostDto,
    @Param('authorID', ParseIntPipe) authorID: number,
  ) {
    return this.postsService.create(createPostDto, authorID);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
