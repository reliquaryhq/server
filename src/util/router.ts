import Koa from 'koa';
import KoaRouter from '@koa/router';
import { SessionContext } from '../middleware/session';
import { SessionState } from '../types';

const createRouter = (
  opt?: KoaRouter.IRouterOptions
): KoaRouter<Koa.DefaultState, SessionContext<SessionState>> =>
  new KoaRouter<Koa.DefaultState, SessionContext<SessionState>>(opt);

export { createRouter };
