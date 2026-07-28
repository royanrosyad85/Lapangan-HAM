'use client';

import { Download } from 'lucide-react';

type Props = {
  invoiceNumber: string;
  children: React.ReactNode;
};

export function InvoiceClient({ invoiceNumber, children }: Props) {
  return (
    <main className="min-h-screen bg-[var(--bg-body)] px-4 py-6 text-[var(--text-primary)] sm:px-6 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-3xl justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--text-primary)] px-3 text-sm font-medium text-[var(--bg-card)] transition hover:opacity-85"
        >
          <Download size={16} /> Print / Save as PDF
        </button>
      </div>
      <article className="mx-auto max-w-3xl bg-[var(--bg-card)] p-6 shadow-sm ring-1 ring-[var(--border-subtle)] sm:p-10 print:max-w-none print:p-0 print:shadow-none print:ring-0">
        {children}
        <p className="mt-10 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-muted)]">
          Invoice {invoiceNumber} · HAM Stadium Booking
        </p>
      </article>
    </main>
  );
}
