#!/usr/bin/env node

import app from './app';
import { db } from './util';

const main = async (): Promise<void> => {
  await db.migrate();
  app.listen(3000);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
