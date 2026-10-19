"use client";

import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold text-[var(--color-navy)]">Something went wrong</h1>
      <p className="max-w-sm text-sm text-[var(--color-muted)]">
        {error.digest
          ? `Please try again. If this keeps happening, contact the clinic with reference ${error.digest}.`
          : "Please try again."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
