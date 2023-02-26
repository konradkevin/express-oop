import { NextFunction, Request, Response } from 'express';
import { Middleware } from '../interfaces';
import { Module } from './module';
import { Handler } from './handler';

class MockMiddleware implements Middleware {
  use = (req: Request, res: Response, next: NextFunction) => {
    next();
  };
}

class MockHandler extends Handler {
  handle = (req: Request, res: Response, next: NextFunction) => {
    next();
  };
}

describe('Module', function () {
  it('should have public attributes: path, router', function () {
    const path = 'users';
    const module = new Module({ path: 'users' });

    expect(module.path).toEqual(path);
    expect(Array.isArray(module.router.stack)).toBeTruthy();
    expect(module.router.stack.length).toEqual(0);
  });

  it('should have concatenated stack in express router', function () {
    const path = 'users';
    const usersModule = new Module({
      path,
      middlewares: [new MockMiddleware(), new MockMiddleware()],
      handlers: [
        new MockHandler({ verb: 'get', path: '' }), // GET /users
        new MockHandler({ verb: 'post', path: '' }), // POST /users
      ],
      modules: [
        new Module({
          path: ':id',
          handlers: [
            new MockHandler({ verb: 'get', path: '' }), // GET /users/:id
            new MockHandler({ verb: 'patch', path: ':id' }), // PATCH /users/:id
          ],
          modules: [
            new Module({
              path: 'cars',
              handlers: [
                new MockHandler({ verb: 'get', path: '' }), // GET /users/:id/cars
                new MockHandler({ verb: 'put', path: ':id' }), // GET /users/:id/cars/:id
              ],
            }),
            new Module({
              path: 'books',
              handlers: [
                new MockHandler({ verb: 'get', path: '' }), // GET /users/:id/books
                new MockHandler({ verb: 'put', path: ':id' }), // GET /users/:id/books/:id
              ],
            }),
          ],
        }),
      ],
    });

    expect(usersModule.path).toEqual(path);
    expect(Array.isArray(usersModule.router.stack)).toBeTruthy();
    expect(usersModule.router.stack.length).toEqual(5);
  });
});
