import { HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
export declare class PostsService {
    private readonly usersService;
    constructor(usersService: UsersService);
    posts: Post[];
    create(createPostDto: CreatePostDto, authorID: number): {
        statusCode: HttpStatus;
        message: string;
    };
    findAll(): Post[];
    findOne(id: number): string;
    update(id: number, updatePostDto: UpdatePostDto): string;
    remove(id: number): string;
}
