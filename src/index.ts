#!/usr/bin/env node

import Koa from 'koa';
import Router from '@koa/router';
import * as db from './util/db';

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = 'Hello World';
});

const main = async (): Promise<void> => {
  await db.migrate();

  app.use(router.routes());
  app.listen(3000);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
