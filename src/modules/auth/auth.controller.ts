import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'core/decorators/public.decorator';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { LogUserInDto } from './dto/log-user-in.dto';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @Public()
  @Post('register-user')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.registerService.registerUser(createUserDto);
  }

  @Public()
  @Post('login-user')
  logUserIn(@Body() logUserInDto: LogUserInDto) {
    return this.loginService.logUserIn(logUserInDto);
  }

  // TODO: Logout route
}