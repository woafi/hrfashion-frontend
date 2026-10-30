/**
 * Seed the admin account from .env (NEXT_PUBLIC_DEMO_EMAIL / NEXT_PUBLIC_DEMO_PASSWORD).
 *
 * - Creates the account through better-auth's server API (auth.api.signUpEmail) so the
 *   stored password hash matches better-auth's native format exactly.
 * - Sets role = "admin" on the `user` document (the backend reads `role` from the JWT).
 * - Verifies the credentials afterward via auth.api.signInEmail.
 *
 * Values are read from the local .env and are never logged.
 * Run: npx tsx scripts/seed-admin.ts  (from hrfashion-frontend/)
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  // Dynamic imports inside main(): env must be loaded before src/lib/mongodb is evaluated
  // (static imports are hoisted and would run before loadEnvConfig), and the frontend
  // package is CommonJS, so top-level await is not available in this script.
  const { auth } = await import("../src/lib/auth");
  const client = (await import("../src/lib/mongodb")).default;

  const DEMO_EMAIL = (process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@hrfashion.com").toLowerCase();
  const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Demo1234!";

  type WithStrId = { _id?: string; id?: string; role?: string; email?: string };

  await client.connect();
  const db = client.db(process.env.DATABASE_NAME as string);

  // 1. Create the account via better-auth (skips silently if it already exists)
  try {
    const res = await auth.api.signUpEmail({
      body: { name: "Admin", email: DEMO_EMAIL, password: DEMO_PASSWORD },
    });
    console.log("signUpEmail created user", (res.user as WithStrId).id);
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e.code !== "USER_ALREADY_EXISTS" && !/already|exist/i.test(e.message ?? "")) {
      throw err;
    }
    console.log("user already exists — will ensure role=admin and verify the password");
  }

  // 2. Promote to admin directly in the `user` collection (owned by better-auth)
  const user = (await db.collection("user").findOne({ email: DEMO_EMAIL })) as (WithStrId & {
    _id: unknown;
  }) | null;
  if (!user) throw new Error("seed failed: user document not found after signup");

  if (user.role !== "admin") {
    await db
      .collection("user")
      .updateOne({ _id: user._id }, { $set: { role: "admin" } });
    console.log("set role=admin on user");
  }

  // 3. Verify the seeded credentials by signing in through better-auth
  const signin = await auth.api.signInEmail({
    body: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
  });

  // 4. Report final state without printing any secrets
  const userId = user.id || user._id;
  const account = await db.collection("account").findOne({ userId });
  console.log("seed complete:", {
    userId,
    email: DEMO_EMAIL,
    role: "admin",
    hasCredentialAccount: Boolean(account),
    signInVerified: Boolean(signin.user),
  });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("seed failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
