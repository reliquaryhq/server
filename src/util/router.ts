import Koa from 'koa';
import KoaRouter from '@koa/router';
import { AppContext } from '../types';

const createRouter = (
  opt?: KoaRouter.IRouterOptions
): KoaRouter<Koa.DefaultState, AppContext> =>
  new KoaRouter<Koa.DefaultState, AppContext>(opt);

export { createRouter };
