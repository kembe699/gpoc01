"use client";

import { Button } from "@/components/ui/Button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-lg font-semibold text-[var(--color-navy)]">Something went wrong</h1>
      <p className="max-w-sm text-sm text-[var(--color-muted)]">
        {error.digest
          ? `Please try again. If this keeps happening, contact the clinic with reference ${error.digest}.`
          : "Please try again."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
