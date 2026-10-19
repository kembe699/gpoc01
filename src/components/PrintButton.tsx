"use client";

import { Printer } from "lucide-react";
import { Button } from "./ui/Button";

export function PrintButton() {
  return (
    <Button variant="secondary" type="button" className="w-full sm:w-auto" onClick={() => window.print()}>
      <Printer size={16} aria-hidden="true" />
      Print
    </Button>
  );
}
