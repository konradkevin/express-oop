import { RequestHandler, ErrorRequestHandler } from 'express';

export interface Middleware {
  use: RequestHandler | ErrorRequestHandler;
}
