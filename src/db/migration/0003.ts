import { DatabaseMigrationType } from '../../util/db';

const up: DatabaseMigrationType = async (connection, sql) => {
  return connection.query(sql`
    CREATE TABLE blobs (
      id BIGSERIAL PRIMARY KEY,
      signature TEXT NOT NULL UNIQUE,
      size BIGINT NOT NULL,
      compressed_size BIGINT NOT NULL,
      md5 BYTEA,
      sha1 BYTEA,
      sha256 BYTEA,
      compressed_md5 BYTEA,
      compressed_sha1 BYTEA,
      compressed_sha256 BYTEA,
      name TEXT NOT NULL,
      ext TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE sources (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE copy_protections (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_controllers (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_drives (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      firmware TEXT,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_formats (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_modification_states (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_read_states (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_tools (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE cdroms (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE cdrom_dumps (
      id BIGSERIAL PRIMARY KEY,
      cdrom_id BIGINT NOT NULL REFERENCES cdroms (id),
      copy_protection_id BIGINT REFERENCES copy_protections (id),
      dump_controller_id BIGINT REFERENCES dump_controllers (id),
      dump_drive_id BIGINT REFERENCES dump_drives (id),
      dump_format_id BIGINT NOT NULL REFERENCES dump_formats (id),
      dump_modification_state_id BIGINT REFERENCES dump_modification_states (id),
      dump_read_state_id BIGINT REFERENCES dump_read_states (id),
      dump_tool_id BIGINT REFERENCES dump_tools (id),
      source_id BIGINT REFERENCES sources (id),
      user_id BIGINT NOT NULL REFERENCES users (id),
      index INTEGER,
      label_name TEXT,
      label_legalese TEXT,
      label_part_number TEXT,
      label_version TEXT,
      mastering_code TEXT,
      mastering_sid_code TEXT,
      toolstamp_code TEXT,
      mould_sid_code TEXT,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE cdrom_dump_files (
      id BIGSERIAL PRIMARY KEY,
      cdrom_dump_id BIGINT NOT NULL REFERENCES cdrom_dumps (id),
      blob_id BIGINT REFERENCES blobs (id),
      path TEXT NOT NULL,
      name TEXT NOT NULL,
      ext TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL,

      UNIQUE (cdrom_dump_id, path)
    );
  `);
};

const down: DatabaseMigrationType = async (connection, sql) => {
  return connection.query(sql`
    DROP TABLE cdroms;
  `);
};

export { up, down };
