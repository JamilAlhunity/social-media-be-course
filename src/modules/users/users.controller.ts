import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { ROUTES } from 'shared/constants/routes.constant';

@ApiTags(ROUTES.USERS.CONTROLLER)
@Controller(ROUTES.USERS.CONTROLLER)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(ROUTES.USERS.FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(ROUTES.USERS.FIND_ONE)
  findOne(@Param('userID', ParseIntPipe) userID: number) {
    return this.usersService.findOne(userID);
  }

  @Patch(ROUTES.USERS.UPDATE_ONE)
  update(
    @Param('userID', ParseIntPipe) userID: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userID, updateUserDto);
  }

  @Delete(ROUTES.USERS.DELETE_ONE)
  remove(@Param('userID') userID: string) {
    return this.usersService.remove(+userID);
  }
}
