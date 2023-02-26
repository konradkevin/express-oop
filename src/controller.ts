import { Router, IRouter } from 'express';
import { Middleware } from './middleware';
import { Handler } from './handler';

interface ControllerParams {
  path: string;
  middlewares?: Middleware[];
  controllers?: Controller[];
  handlers?: Handler[];
}

export class Controller {
  public router: IRouter = Router();
  public path: string;

  constructor(params: ControllerParams) {
    this.path = params.path;

    this.applyMiddlewares(params.middlewares);
    this.registerSubControllers(params.controllers);
    this.registerHandlers(params.handlers);
  }

  private applyMiddlewares(middlewares?: Middleware[]) {
    if (!middlewares?.length) {
      return;
    }

    for (let i = 0; i < middlewares.length; i++) {
      this.router.use(middlewares[i].use);
    }
  }

  private registerSubControllers(controllers?: Controller[]) {
    if (!controllers?.length) {
      return;
    }

    for (let i = 0; i < controllers.length; i++) {
      this.router.use(controllers[i].path, controllers[i].router);
    }
  }

  private registerHandlers(handlers?: Handler[]) {
    if (!handlers?.length) {
      return;
    }

    for (let i = 0; i < handlers.length; i++) {
      this.router[handlers[i].verb](
        handlers[i].path,
        ...handlers[i].middlewares
      );
    }
  }
}
