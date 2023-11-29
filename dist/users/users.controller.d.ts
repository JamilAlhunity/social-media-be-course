import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): import("./entities/user.entity").User[];
    findOne(id: number): import("./entities/user.entity").User;
    update(id: number, updateUserDto: UpdateUserDto): {
        data: import("./entities/user.entity").User;
        message: string;
        statusCode: import("@nestjs/common").HttpStatus;
    };
    remove(id: string): string;
}
