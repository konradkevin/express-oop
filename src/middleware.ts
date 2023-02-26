import { RequestHandler } from 'express';

export interface Middleware {
  use: RequestHandler;
}
