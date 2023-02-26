import { Router, IRouter } from 'express';
import { Middleware } from './middleware';
import { Handler } from './handler';

interface ModuleParams {
  path: string;
  middlewares?: Middleware[];
  modules?: Module[];
  handlers?: Handler[];
}

export class Module {
  public router: IRouter = Router();
  public path: string;

  constructor(params: ModuleParams) {
    this.path = params.path;

    this.applyMiddlewares(params.middlewares);
    this.registerSubModules(params.modules);
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

  private registerSubModules(modules?: Module[]) {
    if (!modules?.length) {
      return;
    }

    for (let i = 0; i < modules.length; i++) {
      this.router.use(modules[i].path, modules[i].router);
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
