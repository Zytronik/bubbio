import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/auth.dto.createUser';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }
}
