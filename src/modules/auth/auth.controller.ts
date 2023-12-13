import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { ApiResponse } from '@nestjs/swagger/dist/decorators';
import { Public } from 'core/decorators/public.decorator';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { registerRouteApiResponse } from './constants/register-route-api-response.conatant';
import { LogUserInDto } from './dto/log-user-in.dto';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @Public()
  @ApiResponse(registerRouteApiResponse)
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
