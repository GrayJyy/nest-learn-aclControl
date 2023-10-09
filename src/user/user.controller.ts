import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Session,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('init')
  async initData() {
    this.userService.initData();
    return 'done';
  }

  @Post('login')
  async login(@Body(ValidationPipe) user: LoginDto, @Session() session) {
    const _foundedUser = await this.userService.login(user);
    session.user = {
      username: _foundedUser.username,
    };
    return 'success';
    // console.log(_foundedUser);
  }

  @Post('register')
  register() {}
}
