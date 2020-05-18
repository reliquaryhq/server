import { NewSource, Source } from '@reliquaryhq/types';
import { db, router } from '../util';

const source = router.createRouter({ prefix: '/source' });

source.post('/', async (ctx) => {
  if (!ctx.state.user) {
    ctx.response.status = 401;
    return;
  }

  const request = ctx.request.body as NewSource;

  if (!request.name) {
    ctx.response.status = 400;
    return;
  }

  let source: Source | null = null;

  await db.transaction(async (connection) => {
    source = await connection.one<Source>(db.sql`
      INSERT INTO
        sources (
          user_id,
          name,
          notes,
          created_at,
          updated_at
        )
      VALUES
        (
          ${ctx.state.user?.id ?? null},
          ${request?.name ?? null},
          ${request?.notes ?? null},
          NOW(),
          NOW()
        )
      RETURNING
        *;
    `);
  });

  ctx.response.status = 200;
  ctx.response.body = source;
});

source.get('/', async (ctx) => {
  if (!ctx.state.user) {
    ctx.response.status = 401;
    return;
  }

  const where = [];

  if (ctx.query.userId) {
    where.push(db.sql`user_id = ${parseInt(ctx.query.userId, 10)}`);
  }

  const sources = await db.connection.any<Source>(db.sql`
    SELECT
      *
    FROM
      sources
    ${db.where(where)};
  `);

  ctx.response.status = 200;
  ctx.response.body = sources;
});

source.get('/:id', async (ctx) => {
  if (!ctx.state.user) {
    ctx.response.status = 401;
    return;
  }

  const where = [];

  where.push(db.sql`id = ${ctx.params.id}`);

  const source = await db.connection.maybeOne<Source>(db.sql`
    SELECT
      *
    FROM
      sources
    ${db.where(where)};
  `);

  if (source) {
    ctx.response.status = 200;
    ctx.response.body = source;
    return;
  }

  ctx.response.status = 404;
});

source.put('/:id', async (ctx) => {
  if (!ctx.state.user) {
    ctx.response.status = 401;
    return;
  }

  const source: Source | null = await db.connection.maybeOne<Source>(db.sql`
    SELECT
      *
    FROM
      sources
    WHERE
      id = ${ctx.params.id};
  `);

  if (!source) {
    ctx.response.status = 404;
    return;
  }

  if (source.userId !== ctx.state.user.id) {
    ctx.response.status = 403;
    return;
  }

  const request = ctx.request.body as Source;

  if (!request.name) {
    ctx.response.status = 400;
    return;
  }

  let updatedSource: Source | null = null;

  await db.transaction(async (connection) => {
    updatedSource = await connection.one<Source>(db.sql`
      UPDATE
        sources
      SET
        name = ${request?.name ?? null},
        notes = ${request?.notes ?? null},
        updated_at = NOW()
      WHERE
        id = ${source.id}
      RETURNING *;
    `);
  });

  ctx.response.status = 200;
  ctx.response.body = updatedSource;
});

source.delete('/:id', async (ctx) => {
  if (!ctx.state.user) {
    ctx.response.status = 401;
    return;
  }

  const source: Source | null = await db.connection.maybeOne<Source>(db.sql`
    SELECT
      *
    FROM
      sources
    WHERE
      id = ${ctx.params.id};
  `);

  if (!source) {
    ctx.response.status = 404;
    return;
  }

  if (source.userId !== ctx.state.user.id) {
    ctx.response.status = 403;
    return;
  }

  await db.transaction(async (connection) => {
    await connection.query<Source>(db.sql`
      DELETE FROM
        sources
      WHERE
        id = ${source.id};
    `);
  });

  ctx.response.status = 200;
});

export default source;
