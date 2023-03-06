import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { Handler, Middleware, Controller } from '../src';

const mockAuthenticationMiddleware = jest.fn();
class AuthenticationMiddleware implements Middleware {
  use = (req: Request, res: Response, next: NextFunction) => {
    mockAuthenticationMiddleware(req, res, next);
    next();
  };
}

const mockAuthorizationMiddleware = jest.fn();
class AuthorizationMiddleware implements Middleware {
  use = (req: Request, res: Response, next: NextFunction) => {
    mockAuthorizationMiddleware(req, res, next);
    next();
  };
}

const mockLoggerMiddleware = jest.fn();
class LoggerMiddleware implements Middleware {
  use = (req: Request, res: Response, next: NextFunction) => {
    mockLoggerMiddleware(req, res, next);
    next();
  };
}

const mockUsersGetAllHandler = jest.fn();
class UsersGetAllHandler extends Handler {
  handle = (req: Request, res: Response, next: NextFunction) => {
    mockUsersGetAllHandler(req, res, next);
    next();
  };
}

const mockUsersGetOneByIdHandler = jest.fn();
class UsersGetOneByIdHandler extends Handler {
  handle = (req: Request, res: Response, next: NextFunction) => {
    mockUsersGetOneByIdHandler(req, res, next);
    next();
  };
}

const mockUsersCarsGetAllHandler = jest.fn();
class UsersCarsGetAllHandler extends Handler {
  handle = (req: Request, res: Response, next: NextFunction) => {
    mockUsersCarsGetAllHandler(req, res, next);
    next();
  };
}

const mockUsersCarsUpdateOneHandler = jest.fn();
class UsersCarsUpdateOneHandler extends Handler {
  handle = (req: Request, res: Response, next: NextFunction) => {
    mockUsersCarsUpdateOneHandler(req, res, next);
    next();
  };
}

describe('Controller', function () {
  const authenticationMiddleware = new AuthenticationMiddleware();
  const authorizationMiddleware = new AuthorizationMiddleware();
  const loggerMiddleware = new LoggerMiddleware();
  const usersGetAllHandler = new UsersGetAllHandler({ verb: 'get', path: '/' });
  const usersGetOneByIdHandler = new UsersGetOneByIdHandler({
    verb: 'get',
    path: '/',
    middlewares: {
      before: [authorizationMiddleware],
      after: [loggerMiddleware],
    },
  });
  const usersCarsGetAllHandler = new UsersCarsGetAllHandler({
    verb: 'get',
    path: '/',
    middlewares: {
      before: [loggerMiddleware],
    },
  });
  const usersCarsUpdateOneHandler = new UsersCarsUpdateOneHandler({
    verb: 'put',
    path: '/:id',
  });

  const testController = new Controller({
    path: '/users',
    middlewares: {
      before: [authenticationMiddleware],
    },
    handlers: [
      usersGetAllHandler, // GET /users
    ],
    controllers: [
      new Controller({
        path: '/:id',
        handlers: [
          usersGetOneByIdHandler, // GET /users/:id
        ],
        controllers: [
          new Controller({
            path: '/cars',
            middlewares: {
              before: [authorizationMiddleware],
            },
            handlers: [
              usersCarsGetAllHandler, // GET /users/:id/cars
              usersCarsUpdateOneHandler, // PUT /users/:id/cars/:id
            ],
          }),
        ],
      }),
    ],
  });

  const app = express();
  app.use(testController.path, testController.router);

  beforeEach(jest.resetAllMocks);

  it('should call corresponding middlewares when GET /users', async function () {
    await request(app).get('/users');

    expect(mockAuthenticationMiddleware).toHaveBeenCalledTimes(1);
    expect(mockAuthorizationMiddleware).toHaveBeenCalledTimes(0);
    expect(mockLoggerMiddleware).toHaveBeenCalledTimes(0);
    expect(mockUsersGetAllHandler).toHaveBeenCalledTimes(1);
    expect(mockUsersGetOneByIdHandler).toHaveBeenCalledTimes(0);
    expect(mockUsersCarsGetAllHandler).toHaveBeenCalledTimes(0);
    expect(mockUsersCarsUpdateOneHandler).toHaveBeenCalledTimes(0);
  });

  it('should call corresponding middlewares when GET /users/:id', async function () {
    await request(app).get('/users/1');

    expect(mockAuthenticationMiddleware).toHaveBeenCalledTimes(1);
    expect(mockAuthorizationMiddleware).toHaveBeenCalledTimes(1);
    expect(mockLoggerMiddleware).toHaveBeenCalledTimes(1);
    expect(mockUsersGetAllHandler).toHaveBeenCalledTimes(0);
    expect(mockUsersGetOneByIdHandler).toHaveBeenCalledTimes(1);
    expect(mockUsersCarsGetAllHandler).toHaveBeenCalledTimes(0);
    expect(mockUsersCarsUpdateOneHandler).toHaveBeenCalledTimes(0);
  });

  it('should call corresponding middlewares when GET /users/:id/cars', async function () {
    await request(app).get('/users/1/cars');

    expect(mockAuthenticationMiddleware).toHaveBeenCalledTimes(1);
    expect(mockAuthorizationMiddleware).toHaveBeenCalledTimes(1);
    expect(mockLoggerMiddleware).toHaveBeenCalledTimes(1);
    expect(mockUsersGetAllHandler).toHaveBeenCalledTimes(0);
    expect(mockUsersGetOneByIdHandler).toHaveBeenCalledTimes(0);
    expect(mockUsersCarsGetAllHandler).toHaveBeenCalledTimes(1);
    expect(mockUsersCarsUpdateOneHandler).toHaveBeenCalledTimes(0);
  });
});
