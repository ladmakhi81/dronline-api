import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/guards/access-token';
import { UserService } from 'src/services/user';
import { File } from 'src/types/file';

@Controller('/users')
export class UserController {
  constructor(@Inject() private readonly userService: UserService) {}

  @Post('upload-image')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  uploadUserProfileImage(@UploadedFile() file: File) {
    return this.userService.uploadImage(file);
  }

  @Post('/:type')
  @UseGuards(AccessTokenGuard)
  createUser(@Param('type') type: string, @Body() dto: Record<string, any>) {
    return this.userService.createUser(type, dto);
  }

  @Get()
  getUsers(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query() query: Record<string, any> = {},
  ) {
    return this.userService.getUsers(
      Number.isNaN(+page) ? 0 : +page,
      Number.isNaN(+limit) ? 10 : +limit,
      query,
    );
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteById(id);
  }

  @Patch(':id/:type')
  @UseGuards(AccessTokenGuard)
  editUserById(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: string,
    @Body() dto: Record<string, any>,
  ) {
    return this.userService.editUser(type, id, dto);
  }
}
