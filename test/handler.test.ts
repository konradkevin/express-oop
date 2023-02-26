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
    expect(Array.isArray(handler.middlewares)).toBeTruthy();
    expect(handler.middlewares.length).toEqual(1);
    expect(handler.middlewares).toEqual([expect.anything()]);
  });

  it('should have concatenated before and after middlewares', function () {
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
    expect(Array.isArray(handler.middlewares)).toBeTruthy();
    expect(handler.middlewares.length).toEqual(3);
    expect(handler.middlewares).toEqual([
      beforeMiddleware.use,
      expect.anything(),
      afterMiddleware.use,
    ]);
  });
});
