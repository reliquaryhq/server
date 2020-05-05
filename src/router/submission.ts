import { db, router } from '../util';
import { CdromDescription, CdromDump } from '../types';

const submission = router.createRouter({ prefix: '/submissions' });

submission.post('/', async (ctx) => {
  if (!ctx.state.user) {
    ctx.response.status = 401;
    return;
  }

  const { cdromDescription, cdromDump } = ctx.request.body as {
    cdromDescription: CdromDescription;
    cdromDump: CdromDump;
  };

  if (!cdromDescription && !cdromDump) {
    ctx.response.status = 400;
    return;
  }

  db.transaction(async (connection) => {
    const submission = await connection.one(db.sql`
      INSERT INTO submissions (
        user_id,
        created_at,
        updated_at
      ) VALUES (
        ${ctx.session.state.userId || null},
        NOW(),
        NOW()
      ) RETURNING id;
    `);

    if (cdromDescription) {
      await connection.query(db.sql`
        INSERT INTO cdrom_descriptions (
          cdrom_id,
          source_id,
          submission_id,
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
          ${cdromDescription.cdromId || null},
          ${cdromDescription.sourceId || null},
          ${submission.id},
          ${cdromDescription.discIndex || null},
          ${cdromDescription.labelProductName || null},
          ${cdromDescription.labelDiscName || null},
          ${cdromDescription.labelLegalese || null},
          ${cdromDescription.labelPartNumber || null},
          ${cdromDescription.labelVersion || null},
          ${cdromDescription.masteringCode || null},
          ${cdromDescription.masteringSidCode || null},
          ${cdromDescription.toolstampCode || null},
          ${cdromDescription.mouldSidCode || null},
          ${cdromDescription.notes || null},
          NOW(),
          NOW()
        );
      `);
    }

    if (cdromDump) {
      await connection.query(db.sql`
        INSERT INTO cdrom_dumps (
          cdrom_id,
          copy_protection_id,
          dump_controller_id,
          dump_drive_id,
          dump_format_id,
          dump_modification_state_id,
          dump_read_state_id,
          dump_tool_id,
          source_id,
          submission_id,
          notes,
          created_at,
          updated_at
        ) VALUES (
          ${cdromDump.cdromId || null},
          ${cdromDump.copyProtectionId || null},
          ${cdromDump.dumpControllerId || null},
          ${cdromDump.dumpDriveId || null},
          ${cdromDump.dumpFormatId || null},
          ${cdromDump.dumpModificationStateId || null},
          ${cdromDump.dumpReadStateId || null},
          ${cdromDump.dumpToolId || null},
          ${cdromDump.sourceId || null},
          ${submission.id || null},
          ${cdromDump.notes || null},
          NOW(),
          NOW()
        );
      `);
    }
  });
});

export default submission;
