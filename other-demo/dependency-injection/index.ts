import http from 'http';
import { Controller, Get } from './core';

@Controller('/user')
class UserController {
  @Get('/list')
  async userList() {
    return {
      success: true,
      data: 'yl',
    };
  }
}
