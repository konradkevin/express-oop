import { NextFunction, Request, Response } from 'express';
import { Handler, Middleware, Controller } from '../src';

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

describe('Controller', function () {
  it('should have public attributes: path, router', function () {
    const path = 'users';
    const controller = new Controller({ path: 'users' });

    expect(controller.path).toEqual(path);
    expect(Array.isArray(controller.router.stack)).toBeTruthy();
    expect(controller.router.stack.length).toEqual(0);
  });

  it('should have concatenated stack in express router', function () {
    const path = 'users';
    const usersController = new Controller({
      path,
      middlewares: [new MockMiddleware(), new MockMiddleware()],
      handlers: [
        new MockHandler({ verb: 'get', path: '' }), // GET /users
        new MockHandler({ verb: 'post', path: '' }), // POST /users
      ],
      controllers: [
        new Controller({
          path: ':id',
          handlers: [
            new MockHandler({ verb: 'get', path: '' }), // GET /users/:id
            new MockHandler({ verb: 'patch', path: ':id' }), // PATCH /users/:id
          ],
          controllers: [
            new Controller({
              path: 'cars',
              handlers: [
                new MockHandler({ verb: 'get', path: '' }), // GET /users/:id/cars
                new MockHandler({ verb: 'put', path: ':id' }), // GET /users/:id/cars/:id
              ],
            }),
            new Controller({
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

    expect(usersController.path).toEqual(path);
    expect(Array.isArray(usersController.router.stack)).toBeTruthy();
    expect(usersController.router.stack.length).toEqual(5);
  });
});
