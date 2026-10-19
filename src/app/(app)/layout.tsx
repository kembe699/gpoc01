import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppNav } from "@/components/AppNav";

// Middleware only checks that a session cookie exists, as a fast
// redirect for the obvious case. Every protected page re-checks the
// session for real here — this layout wraps all of them — so a stale or
// revoked cookie never actually grants access.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav fullName={user.fullName} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
