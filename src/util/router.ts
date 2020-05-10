import KoaRouter from '@koa/router';
import { AppContext, AppState } from '../types';

const createRouter = (
  opt?: KoaRouter.RouterOptions
): KoaRouter<AppState, AppContext> => new KoaRouter<AppState, AppContext>(opt);

export { createRouter };
