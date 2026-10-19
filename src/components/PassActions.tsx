"use client";

import { Printer, Download, FileText } from "lucide-react";
import { Button } from "./ui/Button";

export function PassActions({ id, reference }: { id: string; reference: string }) {
  return (
    <>
      <a href={`/api/screenings/${id}/qr.png`} download={`GPOC-EVD-${reference}.png`}>
        <Button variant="secondary" type="button" className="w-full sm:w-auto">
          <Download size={16} aria-hidden="true" />
          Download QR (PNG)
        </Button>
      </a>
      <a href={`/api/screenings/${id}/pass.pdf`} download={`GPOC-EVD-${reference}.pdf`}>
        <Button variant="secondary" type="button" className="w-full sm:w-auto">
          <FileText size={16} aria-hidden="true" />
          Download pass (PDF)
        </Button>
      </a>
      <Button
        variant="secondary"
        type="button"
        className="w-full sm:w-auto"
        onClick={() => window.print()}
      >
        <Printer size={16} aria-hidden="true" />
        Print
      </Button>
    </>
  );
}
