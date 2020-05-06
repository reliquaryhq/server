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
      slug TEXT NOT NULL UNIQUE,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_read_states (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
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

    CREATE TABLE submission_states (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE cdroms (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE cdrom_submissions (
      id BIGSERIAL PRIMARY KEY,
      cdrom_id BIGINT REFERENCES cdroms (id),
      source_id BIGINT REFERENCES sources (id),
      submission_state_id BIGINT NOT NULL REFERENCES submission_states (id),
      user_id BIGINT NOT NULL REFERENCES users (id),
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE cdrom_descriptions (
      id BIGSERIAL PRIMARY KEY,
      cdrom_id BIGINT NOT NULL REFERENCES cdroms (id),
      cdrom_submission_id BIGINT NOT NULL REFERENCES cdrom_submissions (id),
      disc_index INTEGER,
      label_product_name TEXT,
      label_disc_name TEXT,
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

    CREATE TABLE cdrom_dumps (
      id BIGSERIAL PRIMARY KEY,
      cdrom_id BIGINT NOT NULL REFERENCES cdroms (id),
      cdrom_submission_id BIGINT NOT NULL REFERENCES cdrom_submissions (id),
      copy_protection_id BIGINT REFERENCES copy_protections (id),
      dump_controller_id BIGINT REFERENCES dump_controllers (id),
      dump_drive_id BIGINT REFERENCES dump_drives (id),
      dump_format_id BIGINT NOT NULL REFERENCES dump_formats (id),
      dump_modification_state_id BIGINT REFERENCES dump_modification_states (id),
      dump_read_state_id BIGINT REFERENCES dump_read_states (id),
      dump_tool_id BIGINT REFERENCES dump_tools (id),
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

    INSERT INTO dump_modification_states
      (name, slug, notes, created_at, updated_at)
    VALUES
      ('Unmodified', 'unmodified', 'No modification from original mastering', NOW(), NOW()),
      ('Modified', 'modified', 'Modified from original mastering', NOW(), NOW());

    INSERT INTO dump_read_states
      (name, slug, notes, created_at, updated_at)
    VALUES
      ('Good', 'good', 'No errors when reading media', NOW(), NOW()),
      ('Damaged', 'damaged', 'Errors from damage or degradation when reading media', NOW(), NOW()),
      ('Copy Protected', 'copy-protected', 'Errors from copy protection when reading media', NOW(), NOW());

    INSERT INTO submission_states
      (name, slug, notes, created_at, updated_at)
    VALUES
      ('Pending', 'pending', 'Waiting for review by moderator', NOW(), NOW()),
      ('Approved', 'approved', 'Approved by moderator', NOW(), NOW()),
      ('Rejected', 'rejected', 'Rejected by moderator', NOW(), NOW());
  `);
};

const down: DatabaseMigrationType = async (connection, sql) => {
  return connection.query(sql`
    DROP TABLE cdrom_dump_files;
    DROP TABLE cdrom_dumps;
    DROP TABLE cdrom_descriptions;
    DROP TABLE cdrom_submissions;
    DROP TABLE cdroms;
    DROP TABLE submission_states;
    DROP TABLE dump_tools;
    DROP TABLE dump_read_states;
    DROP TABLE dump_modification_states;
    DROP TABLE dump_formats;
    DROP TABLE dump_drives;
    DROP TABLE dump_controllers;
    DROP TABLE copy_protections;
    DROP TABLE sources;
    DROP TABLE blobs;
  `);
};

export { up, down };
