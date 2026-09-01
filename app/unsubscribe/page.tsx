import Link from "next/link";
import styles from "./unsubscribe.module.css";

export const metadata = {
  title: "Email preferences · ASC3ND",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ token?: string; status?: string }>;
};

export default async function UnsubscribePage({ searchParams }: Props) {
  const params = await searchParams;
  const token = params.token || "";
  const status = params.status || "";

  const complete = status === "done";
  const failed = status === "error" || status === "invalid";

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.wordmark}>ASC3ND</Link>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>Email preferences</p>
        {complete ? (
          <>
            <h1>You&apos;re unsubscribed.</h1>
            <p>
              We recorded your preference and will stop sending this category of ASC3ND email.
            </p>
            <Link href="/" className={styles.link}>Return to ASC3ND</Link>
          </>
        ) : failed ? (
          <>
            <h1>We couldn&apos;t update that preference.</h1>
            <p>The link may be incomplete or expired. No new marketing permission was added.</p>
            <Link href="/" className={styles.link}>Return to ASC3ND</Link>
          </>
        ) : (
          <>
            <h1>Stop these email updates?</h1>
            <p>
              Confirm below and ASC3ND will record a revoked consent for the exact email purpose connected to this message.
            </p>
            <form method="post" action="/api/unsubscribe">
              <input type="hidden" name="token" value={token} />
              <button type="submit" disabled={!token}>Confirm unsubscribe</button>
            </form>
            <p className={styles.note}>This does not delete your relationship history or event records.</p>
          </>
        )}
      </section>
    </main>
  );
}
