"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor() {
        this.users = [];
    }
    async create(createUserDto) {
        const { password } = createUserDto;
        let length = this.users.length;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new user_entity_1.User({
            ...createUserDto,
            id: length++,
            password: hashedPassword,
        });
        this.users.push(user);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Created User Successfully',
        };
    }
    findAll() {
        return this.users;
    }
    findOne(id) {
        return this.users.find((user) => user.id === id);
    }
    update(id, updateUserDto) {
        const user = this.users.find((user) => user.id === id);
        user.updateOne(updateUserDto);
        return {
            data: user,
            message: 'Updated User Successfully',
            statusCode: common_1.HttpStatus.OK,
        };
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map