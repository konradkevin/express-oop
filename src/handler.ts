import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpMethod } from './http-method';
import { Middleware } from './middleware';

interface HandlerParams {
  verb: HttpMethod;
  path: string;
  middlewares?: {
    before?: Middleware[];
    after?: Middleware[];
  };
}

export abstract class Handler {
  public verb: HttpMethod;
  public path: string;
  public middlewares?: {
    before?: Middleware[];
    after?: Middleware[];
  };

  abstract handle: RequestHandler;

  constructor(params: HandlerParams) {
    this.verb = params.verb;
    this.path = params.path;
    this.middlewares = params.middlewares;
  }

  public middleware = (req: Request, res: Response, next: NextFunction) => {
    try {
      this.handle(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
