import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from './middleware/session';
import auth from './middleware/auth';
import router from './router';
import { AppContext, AppState } from './types';
import { process } from './util';

const { RELIQUARY_COOKIE_KEY } = process.env;

const app = new Koa<AppState, AppContext>();

// Signed cookies
app.keys = [RELIQUARY_COOKIE_KEY];

// Middleware
app.use(session());
app.use(auth());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export { AppContext };

export default app;
