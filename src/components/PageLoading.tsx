// Shared loading fallback content, used by each page's own loading.tsx —
// deliberately NOT a shared loading.tsx at the (app) or root level. Next's
// streaming SSR flushes a loading.tsx's fallback (with an HTTP 200) before
// the page below it resolves, and can't change the status code
// afterwards — which breaks notFound() on /screenings/[id] (a non-owner
// would get a 200 with "page not found" text instead of a real 404). Every
// other page is fine with one; that one deliberately has no loading.tsx at
// all, so Next holds the response until the real status is known.
export function PageLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <p className="text-sm text-[var(--color-muted)]">Loading…</p>
    </div>
  );
}
