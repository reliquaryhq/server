import globby from 'globby';
import path from 'path';
import {
  DatabasePoolConnectionType,
  QueryResultType,
  QueryResultRowType,
  SqlTaggedTemplateType,
  createPool,
  sql,
} from 'slonik';
import { MIGRATIONS_DIR } from './fs';
import { env } from './process';

type DatabaseMigrationType = (
  connection: DatabasePoolConnectionType,
  sql: SqlTaggedTemplateType
) => Promise<QueryResultType<QueryResultRowType>>;

const {
  RELIQUARY_POSTGRES_HOST,
  RELIQUARY_POSTGRES_PORT,
  RELIQUARY_POSTGRES_USER,
  RELIQUARY_POSTGRES_PASSWORD,
  RELIQUARY_POSTGRES_DB,
} = env;

const CONNECTION_STRING = `postgres://${RELIQUARY_POSTGRES_USER}:${RELIQUARY_POSTGRES_PASSWORD}@${RELIQUARY_POSTGRES_HOST}:${RELIQUARY_POSTGRES_PORT}/${RELIQUARY_POSTGRES_DB}`;

const pool = createPool(CONNECTION_STRING);

const formatSchemaVersion = (version: string | number): string =>
  version.toString().padStart(4, '0');

const getCurrentSchemaVersion = async (): Promise<number> => {
  const exists = await pool.query(sql`SELECT to_regclass('public.schema');`);

  // Fresh database
  if (exists.rows[0].to_regclass === null) {
    return -1;
  }

  const version = (
    await pool.query(sql`SELECT MAX(version) AS version FROM schema;`)
  ).rows[0].version;

  return version as number;
};

const getNewestSchemaVersion = async (): Promise<number> => {
  const migrations = await globby(`${MIGRATIONS_DIR}/*.js`);

  console.log(`${MIGRATIONS_DIR}/*.ts`);

  // No migrations
  if (migrations.length === 0) {
    return -1;
  }

  const newest = migrations.sort().slice(-1)[0];
  const version = path.basename(newest, '.js');
  return parseInt(version, 10);
};

const applyMigration = async (
  connection: DatabasePoolConnectionType,
  version: number,
  direction: string
): Promise<void> => {
  if (direction === 'up') {
    console.log(`Upgrading database schema to ${formatSchemaVersion(version)}`);
  }

  if (direction === 'down') {
    console.log(
      `Downgrading database schema from ${formatSchemaVersion(version)}`
    );
  }

  const migrationFile = `${version.toString().padStart(4, '0')}.js`;
  const migrationPath = path.resolve(MIGRATIONS_DIR, migrationFile);
  const migration = await import(migrationPath);

  if (direction === 'up') {
    await migration.up(connection, sql);
    await connection.query(
      sql`INSERT INTO schema (version) VALUES (${version});`
    );
  }

  if (direction === 'down') {
    await migration.down(connection, sql);

    if (version > 0) {
      await connection.query(
        sql`DELETE FROM schema WHERE version = ${version};`
      );
    }
  }
};

const migrate = async (to: number | null = null): Promise<void> => {
  const newestVersion = await getNewestSchemaVersion();
  const fromVersion = await getCurrentSchemaVersion();
  const toVersion = to === null ? newestVersion : to;

  if (toVersion > newestVersion || toVersion < -1) {
    throw new Error(`Invalid target version ${formatSchemaVersion(toVersion)}`);
  }

  await pool.connect(async (c) => {
    if (fromVersion < toVersion) {
      for (let version = fromVersion + 1; version <= toVersion; version++) {
        await applyMigration(c, version, 'up');
      }
    }

    if (fromVersion > toVersion) {
      for (let version = fromVersion; version > toVersion; version--) {
        await applyMigration(c, version, 'down');
      }
    }
  });
};

export { DatabaseMigrationType, migrate, pool, sql };
