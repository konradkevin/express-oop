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
  public middlewares: RequestHandler[] = [];

  abstract handle: RequestHandler;

  constructor(params: HandlerParams) {
    this.verb = params.verb;
    this.path = params.path;

    this.applyMiddlewares(params.middlewares?.before);
    this.middlewares.push(this.middleware);
    this.applyMiddlewares(params.middlewares?.after);
  }

  private applyMiddlewares(middlewares?: Middleware[]) {
    if (!middlewares?.length) {
      return;
    }

    for (let i = 0; i < middlewares.length; i++) {
      this.middlewares.push(middlewares[i].use);
    }
  }

  private middleware = (req: Request, res: Response, next: NextFunction) => {
    try {
      this.handle(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
