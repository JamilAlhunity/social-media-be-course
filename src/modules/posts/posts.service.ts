import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'modules/users/users.service';
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
      throw new HttpException(
        'user not found, post service create',
        HttpStatus.BAD_REQUEST,
      );
    let length = this.posts.length;
    const post = new Post({ ...createPostDto, id: length++ });

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
    return this.posts.find((post) => post.id === id);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const post = this.posts.find((post) => post.id === id);
    if (!post)
      throw new HttpException('post not found', HttpStatus.BAD_REQUEST);
    post.updateOne(updatePostDto);
    return {
      data: post,
      message: 'Updated Post Successfully',
      statusCode: HttpStatus.OK,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
