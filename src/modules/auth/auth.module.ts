import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';
import { PasswordService } from './password.service';
import { UsersModule } from 'modules/users/users.module';

@Module({
  controllers: [AuthController],
  providers: [LoginService, RegisterService, PasswordService],
  imports: [UsersModule],
})
export class AuthModule {}
