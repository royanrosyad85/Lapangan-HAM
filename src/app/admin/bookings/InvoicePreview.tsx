'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ExternalLink, ReceiptText, X } from 'lucide-react';
import Link from 'next/link';

export function InvoicePreview({ bookingId, open, onOpenChange }: { bookingId: number | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!bookingId) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 flex h-[min(90vh,900px)] -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl outline-none sm:left-1/2 sm:right-auto sm:w-[min(94vw,1100px)] sm:-translate-x-1/2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
            <Dialog.Title className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <ReceiptText size={16} /> Invoice preview for booking #{bookingId}
            </Dialog.Title>
            <div className="flex items-center gap-2">
              <Link href={`/invoice/${bookingId}`} className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] px-2.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-action-hover)]">
                <ExternalLink size={13} /> Open full page
              </Link>
              <Dialog.Close className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] text-[var(--text-secondary)] hover:bg-[var(--bg-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]" aria-label="Close invoice preview">
                <X size={16} />
              </Dialog.Close>
            </div>
          </div>
          <iframe title={`Invoice booking ${bookingId}`} src={`/invoice/${bookingId}`} className="min-h-0 flex-1 bg-[var(--bg-body)]" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
