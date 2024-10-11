import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CheckUsernameDto } from 'src/_dto/auth.checkUsername';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('usernameIsValid')
    async checkUsernameIsValid(@Query() checkUsernameDto: CheckUsernameDto) {
        return await this.userService.userExists(checkUsernameDto.username);
    }
}
