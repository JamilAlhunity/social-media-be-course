import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { UsersService } from 'modules/users/users.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}
  async registerUser(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    createUserDto.password = hashedPassword;

    // Code that creates a user
    this.usersService.createUserForAuth(createUserDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: this.i18n.t('shared.success.create', {
        args: { entity: this.i18n.t('entities.user') },
      }),
    };
  }
}
