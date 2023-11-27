import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  posts: Post[] = [];
  create(createPostDto: CreatePostDto, authorID: number) {
    const user = this.usersService.findOne(authorID);

    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);

    const post = new Post(createPostDto);

    post.addAuthor(user);

    this.posts.push(post);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created Post Successfully',
    };
  }

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
