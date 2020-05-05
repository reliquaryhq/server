import Koa from 'koa';
import * as db from '../util/db';
import { User } from '../types';

const middleware = (): Koa.Middleware => {
  const middleware: Koa.Middleware = async (ctx, next) => {
    if (ctx.session && ctx.session.state.userId) {
      const user = await db.queryOne<User>(
        db.sql`
          SELECT *
          FROM users
          WHERE id = ${ctx.session.state.userId};
        `
      );

      if (user) {
        ctx.state.user = user;
      }
    }

    await next();
  };

  return middleware;
};

export default middleware;