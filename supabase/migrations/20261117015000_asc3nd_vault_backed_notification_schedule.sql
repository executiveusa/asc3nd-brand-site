-- Reuse existing pg_cron + pg_net to dispatch the existing authenticated worker.
-- Runtime precondition: vault secret "asc3nd_notification_dispatch_token"
-- contains the same private trigger token as the Edge Function secret.
-- No plaintext secrets are stored in migration, cron.job, or repository.
-- Idempotent by cron job name; only sends when the unsent queue is nonempty.
select cron.schedule(
  'asc3nd-notification-outbox-dispatch-v1',
  '* * * * *',
  $cron$
  select net.http_post(
    url := 'https://cyxdevcjycmffhmwxojh.supabase.co/functions/v1/asc3nd-site-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || decrypted_secret
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 10000
  )
  from vault.decrypted_secrets
  where name = 'asc3nd_notification_dispatch_token'
    and exists (
      select 1 from asc3nd.site_notification_outbox
      where status in ('pending', 'failed') and attempt_count < 5
    );
  $cron$
);
