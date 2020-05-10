import {
  NewCdromDescription,
  NewCdromDump,
  CdromSubmission,
  NewCdromSubmission,
} from '@reliquaryhq/types';
import { db, router } from '../util';

const cdrom = router.createRouter({ prefix: '/cdrom' });

cdrom.post('/submissions', async (ctx) => {
  if (!ctx.state.user) {
    ctx.response.status = 401;
    return;
  }

  const request = ctx.request.body as NewCdromSubmission & {
    cdromDescription?: NewCdromDescription;
    cdromDump?: NewCdromDump;
  };

  if (!request.cdromDescription && !request.cdromDump) {
    ctx.response.status = 400;
    return;
  }

  let cdromSubmission;

  await db.transaction(async (connection) => {
    cdromSubmission = await connection.one<CdromSubmission>(db.sql`
      INSERT INTO cdrom_submissions (
        cdrom_id,
        source_id,
        submission_state_id,
        user_id,
        created_at,
        updated_at
      ) VALUES (
        ${request?.cdromId ?? null},
        ${request?.sourceId ?? null},
        (SELECT id FROM submission_states WHERE slug = 'draft'),
        ${ctx.state.user?.id ?? null},
        NOW(),
        NOW()
      ) RETURNING *;
    `);

    if (request.cdromDescription) {
      await connection.query(db.sql`
        INSERT INTO cdrom_descriptions (
          cdrom_id,
          cdrom_submission_id,
          disc_index,
          label_product_name,
          label_disc_name,
          label_legalese,
          label_part_number,
          label_version,
          mastering_code,
          mastering_sid_code,
          toolstamp_code,
          mould_sid_code,
          notes,
          created_at,
          updated_at
        ) VALUES (
          ${cdromSubmission.cdromId ?? null},
          ${cdromSubmission.id ?? null},
          ${request.cdromDescription.discIndex ?? null},
          ${request.cdromDescription.labelProductName ?? null},
          ${request.cdromDescription.labelDiscName ?? null},
          ${request.cdromDescription.labelLegalese ?? null},
          ${request.cdromDescription.labelPartNumber ?? null},
          ${request.cdromDescription.labelVersion ?? null},
          ${request.cdromDescription.masteringCode ?? null},
          ${request.cdromDescription.masteringSidCode ?? null},
          ${request.cdromDescription.toolstampCode ?? null},
          ${request.cdromDescription.mouldSidCode ?? null},
          ${request.cdromDescription.notes ?? null},
          NOW(),
          NOW()
        );
      `);
    }

    if (request.cdromDump) {
      await connection.query(db.sql`
        INSERT INTO cdrom_dumps (
          cdrom_id,
          cdrom_submission_id,
          copy_protection_id,
          dump_controller_id,
          dump_drive_id,
          dump_format_id,
          dump_modification_state_id,
          dump_read_state_id,
          dump_tool_id,
          notes,
          created_at,
          updated_at
        ) VALUES (
          ${cdromSubmission.cdromId ?? null},
          ${cdromSubmission.id ?? null},
          ${request.cdromDump.copyProtectionId ?? null},
          ${request.cdromDump.dumpControllerId ?? null},
          ${request.cdromDump.dumpDriveId ?? null},
          ${request.cdromDump.dumpFormatId ?? null},
          ${request.cdromDump.dumpModificationStateId ?? null},
          ${request.cdromDump.dumpReadStateId ?? null},
          ${request.cdromDump.dumpToolId ?? null},
          ${request.cdromDump.notes ?? null},
          NOW(),
          NOW()
        );
      `);
    }
  });

  ctx.response.body = cdromSubmission;
});

cdrom.get('/submissions', async (ctx) => {
  if (!ctx.state.user) {
    ctx.response.status = 401;
    return;
  }

  const submissions = await db.query<CdromSubmission>(db.sql`
    SELECT *
    FROM cdrom_submissions
    WHERE user_id = ${ctx.state.user.id}
  `);

  ctx.response.body = submissions;
});

cdrom.get('/submissions/:id', async (ctx) => {
  if (!ctx.state.user) {
    ctx.response.status = 401;
    return;
  }

  const cdromSubmission = await db.queryOne<CdromSubmission>(db.sql`
    SELECT *
    FROM cdrom_submissions
    WHERE id = ${ctx.params.id};
  `);

  if (!cdromSubmission) {
    ctx.response.status = 404;
    return;
  }

  if (cdromSubmission.userId !== ctx.state.user.id) {
    ctx.response.status = 403;
    return;
  }

  ctx.response.body = cdromSubmission;
});

export default cdrom;
