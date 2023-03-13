import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/user')
  createAccount(@Body() createUserDto: any): string {
    return this.usersService.createAccount(createUserDto);
  }

  @Get('/user/:userId')
  findOneAccount(@Param() { userId }: any) {
    return this.usersService.findOneAccount(userId);
  }
}