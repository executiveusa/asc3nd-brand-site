# ASC3ND Website Intake → Google Sheet Sync

## Source of truth

Supabase remains canonical. The Google Sheet is an operational mirror only.

## Runtime

- Staff can trigger `POST /api/admin/sheet-sync` from `/admin`.
- Vercel calls `GET /api/cron/sheet-sync` hourly.
- The worker claims pending/failed rows with `FOR UPDATE SKIP LOCKED`.
- A claim becomes `syncing` and increments `sheet_sync_attempts`.
- Failed claims return to `failed`; stale claims can be retried after 15 minutes.
- Attempts stop after five failures for human review.

## Idempotency

Before appending, the worker reads column A of the `Website Intake` tab and compares canonical Supabase submission IDs. A row already present in Sheets is not appended again; it is marked synced in Supabase. This protects against the failure case where Google accepts an append but the Supabase acknowledgement fails afterward.

## Required production secrets

- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `CRON_SECRET`

Optional override:

- `ASC3ND_GOOGLE_SHEET_ID` (defaults to the locked ASC3ND workbook ID)

The Google service account must have edit access to the workbook.

## Form resilience

Take Part forms autosave non-honeypot fields to the visitor's browser local storage. The draft includes the current participation route and idempotency key. Failed/network-interrupted submissions keep the same draft and key so retrying cannot create an accidental duplicate. Drafts are cleared only after the canonical Supabase submission succeeds.

## CSV exports

Both relationship-route CSV and Website Intake CSV fetch fresh authorized data from Supabase at click time. Exports use UTF-8 BOM for spreadsheet compatibility, escape CSV values, timestamp filenames, paginate beyond the visible dashboard page, and report explicit success/failure in the UI.
