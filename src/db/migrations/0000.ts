import { DatabaseMigrationType } from '../../util/db';

const up: DatabaseMigrationType = async (connection, sql) => {
  return connection.query(sql`
    CREATE TABLE schema (
      version INT NOT NULL
    );
  `);
};

const down: DatabaseMigrationType = async (connection, sql) => {
  return connection.query(sql`
    DROP TABLE schema;
  `);
};

export { up, down };
