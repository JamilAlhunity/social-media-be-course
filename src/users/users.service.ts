import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  users: User[] = [];

  createUserForAuth(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const user = this.findUserByEmail(email);
    if (!!user)
      throw new HttpException(
        'Email already exists, please choose another one',
        HttpStatus.CONFLICT,
      );

    let length = this.users.length;

    const createdUser = new User({
      ...createUserDto,
      id: length++,
    });
    this.users.push(createdUser);
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.users.find((user) => user.id === id);
    user.updateOne(updateUserDto);
    return {
      data: user,
      message: 'Updated User Successfully',
      statusCode: HttpStatus.OK,
    };
  }

  remove(id: number) {
    // Task 3 (1)
    return `This action removes a #${id} user`;
  }

  findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
