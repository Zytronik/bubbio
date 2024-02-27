import { BadRequestException, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/auth.jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ValidateImagePipe } from './validateImgPipeline';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    return this.userService.getUserProfileByUsername(req.user.username);
  }

  @Get('userExists')
  async checkUsernameExists(@Query('username') username: string) {
    return await this.userService.userExists(username);
  }

  @Get('search')
  async searchUsers(@Query('query') query: string) {
    return await this.userService.searchUsers(query);
  }

  @Get(':username')
  async getUserProfile(@Param('username') username: string) {
    return this.userService.getUserProfileByUsername(username);
  }

  @Post('updateProfilePic')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePic'))
  async updateProfilePicture(@UploadedFile(new ValidateImagePipe()) file: Express.Multer.File, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    const userId = req.user.userId;
    await this.userService.updateProfileImgs(userId, file, "pb");
    return { message: 'Profile picture updated successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateProfileBanner')
  @UseInterceptors(FileInterceptor('profileBanner'))
  async updateProfileBanner(@UploadedFile(new ValidateImagePipe()) file: Express.Multer.File, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    const userId = req.user.userId;
    await this.userService.updateProfileImgs(userId, file, "banner");
    return { message: 'Banner updated successfully.' };
  }

}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    username: string;
  };
}
