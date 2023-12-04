import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class RegisterService {
  constructor(private readonly usersService: UsersService) {}
  async registerUser(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    createUserDto.password = hashedPassword;

    // Code that creates a user
    this.usersService.createUserForAuth(createUserDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created User Successfully',
    };
  }
}
