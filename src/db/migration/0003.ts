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
      slug TEXT NOT NULL UNIQUE,
      version TEXT,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_controllers (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_drives (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      firmware TEXT,
      notes TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE dump_formats (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      version TEXT,
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
      slug TEXT NOT NULL UNIQUE,
      version TEXT,
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
      cdrom_id BIGINT REFERENCES cdroms (id),
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
      cdrom_id BIGINT REFERENCES cdroms (id),
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

    INSERT INTO copy_protections
      (name, slug, version, notes, created_at, updated_at)
    VALUES
      ('Sierra CPC', 'sierra-cpc', NULL, 'Copy protection scheme used by Sierra for many AGI games on floppy disk.', NOW(), NOW()),
      ('Origin OSI-1', 'origin-osi-1', NULL, 'Copy protection scheme used by Origin Systems.', NOW(), NOW());

    INSERT INTO dump_controllers
      (name, slug, notes, created_at, updated_at)
    VALUES
      ('ATAPI', 'atapi', 'AT Attachment Packet Interface over Parallel ATA or Serial ATA. Typically, an IDE CD / DVD drive connected to an IDE port / IDE-to-USB converter, or a SATA CD / DVD / Blu-Ray drive connected to a SATA port / SATA-to-USB converter.', NOW(), NOW()),
      ('KryoFlux', 'kryoflux', 'KryoFlux USB floppy controller created by SPS.', NOW(), NOW()),
      ('Applesauce', 'applesauce', 'Applesauce floppy controller created by John K. Morris.', NOW(), NOW()),
      ('SuperCard Pro', 'supercard-pro', 'SuperCard Pro floppy controller created by Jim Drew.', NOW(), NOW());

    INSERT INTO dump_drives
      (name, slug, firmware, notes, created_at, updated_at)
    VALUES
      ('Sony MPF920', 'sony-mpf920', NULL, 'Sony MPF920 3.5" floppy drive', NOW(), NOW()),
      ('Plextor PX-W4824TA', 'plextor-px-w4824ta', NULL, 'Plextor PlexWriter 48/24/48A CD-RW drive', NOW(), NOW()),
      ('Plextor PX-716A', 'plextor-px-716a', NULL, 'Plextor PX-716A DVD-RW drive', NOW(), NOW()),
      ('ASUS BW-16D1HT', 'asus-bw-16d1ht', NULL, 'ASUS BW-16D1HT Blu-ray RW drive', NOW(), NOW());

    INSERT INTO dump_formats
      (name, slug, version, notes, created_at, updated_at)
    VALUES
      ('KryoFlux Stream', 'kryoflux-stream', NULL, 'KryoFlux stream dump format for floppy disks. One file per track and side for each disk.', NOW(), NOW()),
      ('DiscImageCreator CD', 'discimagecreator-cd', NULL, 'DiscImageCreator dump format for CDs. One .bin, .c2, .cue, and .sub file for each disc.', NOW(), NOW()),
      ('Alcohol 120% Media Descriptor', 'alcohol-120', NULL, 'Alcohol 120% dump format for CDs and DVDs. One .mds and .mdf for each disc.', NOW(), NOW()),
      ('Aaru Image Format', 'aaru-aif', NULL, 'Aaru dump format. One .aif and .xml for each disc.', NOW(), NOW());

    INSERT INTO dump_modification_states
      (name, slug, notes, created_at, updated_at)
    VALUES
      ('Unmodified', 'unmodified', 'No detected modification from original mastering', NOW(), NOW()),
      ('Modified', 'modified', 'Detected modification from original mastering', NOW(), NOW());

    INSERT INTO dump_read_states
      (name, slug, notes, created_at, updated_at)
    VALUES
      ('Good', 'good', 'No errors or only expected copy protection errors when reading media', NOW(), NOW()),
      ('Damaged', 'damaged', 'Errors from damage or degradation when reading media', NOW(), NOW());

    INSERT INTO dump_tools
      (name, slug, version, notes, created_at, updated_at)
    VALUES
      ('Aaru', 'aaru-5.0.0.2879', '5.0.0.2879', 'Aaru Data Preservation Suite v5.0.0.2879', NOW(), NOW()),
      ('Aaru', 'aaru-5.0.1.2884', '5.0.1.2884', 'Aaru Data Preservation Suite v5.0.1.2884', NOW(), NOW()),
      ('KryoFlux DTC', 'kryoflux-dtc-3.00', '3.00', 'KryoFlux Disk Tool Console v3.00', NOW(), NOW()),
      ('DiscImageCreator', 'discimagecreator-20190326', '20190326', 'DiscImageCreator v20190326', NOW(), NOW()),
      ('DiscImageCreator', 'discimagecreator-20190627', '20190627', 'DiscImageCreator v20190627', NOW(), NOW()),
      ('DiscImageCreator', 'discimagecreator-20191001', '20191001', 'DiscImageCreator v20191001', NOW(), NOW()),
      ('DiscImageCreator', 'discimagecreator-20191116', '20191116', 'DiscImageCreator v20191116', NOW(), NOW()),
      ('DiscImageCreator', 'discimagecreator-20191223', '20191223', 'DiscImageCreator v20191223', NOW(), NOW()),
      ('DiscImageCreator', 'discimagecreator-20200120', '20200120', 'DiscImageCreator v20200120', NOW(), NOW()),
      ('DiscImageCreator', 'discimagecreator-20200203', '20200203', 'DiscImageCreator v20200203', NOW(), NOW()),
      ('DiscImageCreator', 'discimagecreator-20200204', '20200204', 'DiscImageCreator v20200204', NOW(), NOW()),
      ('DiscImageCreator', 'discimagecreator-20200403', '20200403', 'DiscImageCreator v20200403', NOW(), NOW()),
      ('Applesauce', 'applesauce-1.36.1', '1.36.1', 'Applesauce v1.36.1', NOW(), NOW());

    INSERT INTO submission_states
      (name, slug, notes, created_at, updated_at)
    VALUES
      ('Draft', 'draft', 'Preparing to submit', NOW(), NOW()),
      ('Submitted', 'submitted', 'Submitted for review by moderator', NOW(), NOW()),
      ('Reviewing', 'reviewing', 'Under active review by moderator', NOW(), NOW()),
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
