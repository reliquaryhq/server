import { DatabaseMigrationType } from '../../util/db';

const up: DatabaseMigrationType = async (connection, sql) => {
  return connection.query(sql`
    CREATE TABLE users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );
  `);
};

const down: DatabaseMigrationType = async (connection, sql) => {
  return connection.query(sql`
    DROP TABLE users;
  `);
};

export { up, down };
