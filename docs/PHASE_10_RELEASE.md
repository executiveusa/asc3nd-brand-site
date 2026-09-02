# Phase 10 release

Production release marker for the autosave, hardened CSV export, and Supabase-to-Google-Sheet synchronization slice.

Expected production behaviors:
- Take Part drafts survive reload and failed submits until canonical Supabase success.
- Retry uses the same idempotency key to avoid duplicate intake records.
- Admin CSV exports fetch fresh authorized data at click time.
- Google Sheet mirroring remains server-side, duplicate-safe, and status-tracked in Supabase.
- Automatic Sheet writes require production server credentials; no service credentials are exposed to the browser.

Release target: locked Vercel project `prj_9CILXFMCnQh4ZsTirsArBrsVoTfV` from `main`.
