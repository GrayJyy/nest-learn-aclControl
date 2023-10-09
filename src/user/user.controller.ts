import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
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
  login(@Body(ValidationPipe) user: LoginDto) {
    return this.userService.login(user);
    // console.log(_foundedUser);
  }

  @Post('register')
  register() {}
}
