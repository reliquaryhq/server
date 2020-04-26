/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */

declare module '@koa/router' {
  import Koa from 'koa';

  interface RouterOptions {
    prefix?: string;
  }

  class Router {
    constructor(opts?: RouterOptions);

    del(path: string, callback: Koa.Middleware): Router;
    delete(path: string, callback: Koa.Middleware): Router;

    get(path: string, callback: Koa.Middleware): Router;

    patch(path: string, callback: Koa.Middleware): Router;

    post(path: string, callback: Koa.Middleware): Router;

    put(path: string, callback: Koa.Middleware): Router;

    routes(): Koa.Middleware;
  }

  export = Router;
}
