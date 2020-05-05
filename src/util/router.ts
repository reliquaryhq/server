import KoaRouter from '@koa/router';
import { AppContext, AppState } from '../types';

const createRouter = (
  opt?: KoaRouter.IRouterOptions
): KoaRouter<AppState, AppContext> => new KoaRouter<AppState, AppContext>(opt);

export { createRouter };
