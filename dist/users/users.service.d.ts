import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    users: User[];
    createUserForAuth(createUserDto: CreateUserDto): void;
    findAll(): User[];
    findOne(id: number): User;
    update(id: number, updateUserDto: UpdateUserDto): {
        data: User;
        message: string;
        statusCode: HttpStatus;
    };
    remove(id: number): string;
    findUserByEmail(email: string): User;
}
