const SITE_NOTIFICATION_ENDPOINT =
  "https://cyxdevcjycmffhmwxojh.supabase.co/functions/v1/asc3nd-site-notifications";

/**
 * Best-effort delivery of already-persisted public intake notifications.
 * The database remains the source of truth; email delivery failure must never
 * make a successful website submission look failed to the visitor.
 */
export async function triggerSiteNotificationDelivery() {
  try {
    const response = await fetch(SITE_NOTIFICATION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("ASC3ND site notification delivery unavailable", response.status);
    }
  } catch (error) {
    console.error("ASC3ND site notification delivery failed", error);
  }
}
