import { Request, Response, NextFunction } from 'express';
import { Handler, Middleware } from '../src';

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

describe('Handler', function () {
  it('should have public attributes: verb, path, middlewares', function () {
    const verb = 'get';
    const path = '/';
    const handler = new MockHandler({ verb, path });

    expect(handler.verb).toEqual(verb);
    expect(handler.path).toEqual(path);
    expect(handler.middlewares).toBeUndefined();
  });

  it('should have before and after middlewares', function () {
    const verb = 'get';
    const path = '/:id';
    const beforeMiddleware = new MockMiddleware();
    const afterMiddleware = new MockMiddleware();

    const handler = new MockHandler({
      verb,
      path,
      middlewares: {
        before: [beforeMiddleware],
        after: [afterMiddleware],
      },
    });

    expect(handler.verb).toEqual(verb);
    expect(handler.path).toEqual(path);
    expect(handler.middlewares).toEqual({
      before: [beforeMiddleware],
      after: [afterMiddleware],
    });
  });
});
