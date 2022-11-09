import http from 'http';
import { Controller, Get, Post, routerFactory } from './core';

@Controller('/user')
class User {
  @Get('/list')
  async userList() {
    return {
      success: true,
      data: 'list data',
    };
  }

  @Post('/add')
  async addUser() {
    return {
      success: true,
      data: 'ok',
    };
  }
}

const collected = routerFactory(new User());
console.log(collected);

const handleFn: http.RequestListener = (req, res) => {
  collected.some((info) => {
    if (
      req.url === info.path &&
      req.method === info.requestMethod.toLocaleUpperCase()
    ) {
      info.requestHandler().then((data) => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(data));
      });
      return true;
    } else {
      return false;
    }
  });
};

http
  .createServer(handleFn)
  .listen(3000)
  .on('listening', () => {
    console.log('GET /user/list at http://localhost:3000/user/list \n');
    console.log('POST /user/add at http://localhost:3000/user/add \n');
  });
