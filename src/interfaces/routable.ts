import { IRouter } from 'express';

export interface Routable {
  router: IRouter;
  path: string;
}
