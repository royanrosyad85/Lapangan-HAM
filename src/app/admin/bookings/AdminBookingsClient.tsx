'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, ReceiptText, Copy, Phone, Mail, Package, Download, ClipboardCheck } from 'lucide-react';

import { StatusBadge } from '@/components/StatusBadge';
import { DataTable } from '@/components/DataTable';
import { ADD_ON_ITEMS, BUNDLES, type AddOnSnapshot } from '@/config/pricing';
import { BookingActionForm } from './BookingActionForm';
import {
  approveDPFormAction,
  approveFinalPaymentFormAction,
  cancelBookingFormAction,
  completePaymentOfflineFormAction,
} from '@/actions/bookings';
import { currentMonthRange, selectTransactionReportRows, transactionReportHtml } from './transaction-report';
import { InvoicePreview } from './InvoicePreview';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded bg-[var(--bg-body)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-action-hover)] transition cursor-pointer"
    >
      <Copy size={10} className={copied ? 'text-emerald-500' : ''} />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

type BookingItem = {
  id: number;
  fieldName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  price: number;
  dp_amount: number;
  status: string;
  addons: AddOnSnapshot | null;
  receiptUrl: string | null;
  receiptUnavailable: boolean;
  created_at_label: string;
  created_at_sort_key: number;
};

const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

const STATUS_OPTIONS = ['pending', 'dp_paid', 'payment_2_pending', 'paid', 'confirmed', 'cancelled'];
const REVIEW_STATUSES = new Set(['pending', 'payment_2_pending']);

export function AdminBookingsClient({
  bookings,
  loadError = null,
}: {
  bookings: BookingItem[];
  loadError?: string | null;
}) {
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState(() => currentMonthRange());
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [invoiceBookingId, setInvoiceBookingId] = useState<number | null>(null);
  const [visibleBookings, setVisibleBookings] = useState<BookingItem[]>([]);

  useEffect(() => {
    if (!previewImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage]);

  const filtered = statusFilter === 'review'
    ? bookings.filter((booking) => REVIEW_STATUSES.has(booking.status))
    : statusFilter
      ? bookings.filter((booking) => booking.status === statusFilter)
      : bookings;
  const handleFilteredDataChange = useCallback((rows: BookingItem[]) => {
    setVisibleBookings((current) => current.length === rows.length && current.every((row, index) => row.id === rows[index]?.id) ? current : rows);
  }, []);
  const reportRows = visibleBookings.length ? visibleBookings : selectTransactionReportRows(filtered, '', dateRange.from, dateRange.to);
  const reviewCount = bookings.filter((booking) => REVIEW_STATUSES.has(booking.status)).length;

  const printTransactionReport = () => {
    const report = window.open('', '_blank');
    if (!report) return;
    report.addEventListener('load', () => report.print(), { once: true });
    report.document.write(transactionReportHtml(reportRows, dateRange.from, dateRange.to, statusFilter === 'review' ? 'Perlu ditinjau' : statusFilter || 'Semua', `${window.location.origin}/assets/Logo-HAM-fix.png`));
    report.document.close();
    report.focus();
  };

  const renderDetails = (row: BookingItem) => {
    const unpaidBalance = Math.max(0, row.price - row.dp_amount);
    const isFullyPaid = ['confirmed', 'paid'].includes(row.status);
    const fieldPrice = Math.max(0, row.price - (row.addons?.total ?? 0));

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* Kontak Customer */}
        <div className="space-y-2 border-r border-[var(--border-subtle)] pr-6 last:border-r-0">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Customer contact
          </h4>
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Name:</span>
              <span className="font-medium text-[var(--text-primary)]">{row.customerName || '—'}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[var(--text-muted)] flex items-center gap-1">
                <Mail size={12} /> Email:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-[var(--text-primary)] break-all max-w-[120px] md:max-w-[140px] truncate">{row.customerEmail || '—'}</span>
                {row.customerEmail && <CopyButton text={row.customerEmail} />}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[var(--text-muted)] flex items-center gap-1">
                <Phone size={12} /> Phone:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-[var(--text-primary)]">{row.customerPhone || '—'}</span>
                {row.customerPhone && <CopyButton text={row.customerPhone} />}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)]/50">
              <span className="text-[var(--text-muted)]">Field:</span>
              <span className="font-medium text-[var(--text-primary)]">{row.fieldName}</span>
            </div>
          </div>
        </div>

        {/* Payment details */}
        <div className="space-y-2 border-r border-[var(--border-subtle)] pr-6 last:border-r-0">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Payment details
          </h4>
          <div className="space-y-1.5 mt-2">
            {row.addons && row.addons.items.length > 0 && (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Field price:</span>
                  <span className="text-[var(--text-secondary)] tabular-nums">{money.format(fieldPrice)}</span>
                </div>
                <div className="mt-2 space-y-1 border-t border-[var(--border-subtle)]/50 pt-2">
                  <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <Package size={11} /> Add-ons
                    {row.addons.bundle && (
                      <span className="text-emerald-500">· {BUNDLES.find((b) => b.id === row.addons!.bundle)?.label}</span>
                    )}
                  </div>
                  {row.addons.items.map((id) => (
                    <div key={id} className="flex justify-between text-[11px]">
                      <span className="text-[var(--text-muted)]">{ADD_ON_ITEMS.find((a) => a.id === id)?.label ?? id}</span>
                      <span className="text-[var(--text-secondary)] tabular-nums">{money.format(ADD_ON_ITEMS.find((a) => a.id === id)?.price ?? 0)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">Regular price</span>
                    <span className="text-[var(--text-muted)] line-through tabular-nums">{money.format(row.addons.original)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-500">Discount</span>
                    <span className="text-emerald-500 tabular-nums">-{money.format(row.addons.discount)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-[var(--text-secondary)]">Total add-ons</span>
                    <span className="text-[var(--text-primary)] tabular-nums">{money.format(row.addons.total)}</span>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Total price:</span>
              <span className="font-semibold text-[var(--text-primary)] tabular-nums">{money.format(row.price)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Deposit:</span>
              <span className="font-semibold text-[var(--accent-blue)]">{money.format(row.dp_amount)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Balance:</span>
              <span className={`font-semibold ${isFullyPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isFullyPaid ? 'Paid' : money.format(unpaidBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)]/50">
              <span className="text-[var(--text-muted)]">Created:</span>
              <span className="text-[var(--text-secondary)]">{row.created_at_label}</span>
            </div>
          </div>
        </div>

        {/* Payment proof */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Payment proof
          </h4>
          <div className="mt-2">
            {row.receiptUrl ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPreviewImage(row.receiptUrl)}
                  className="btn inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-action-hover)] cursor-pointer"
                >
                  <ReceiptText size={12} />
                  Preview proof
                </button>
                <div className="relative aspect-video max-h-24 md:max-h-28 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-body)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={row.receiptUrl}
                    alt="Payment proof"
                    className="h-full w-full object-contain hover:scale-105 transition duration-200 cursor-zoom-in"
                    onClick={() => setPreviewImage(row.receiptUrl)}
                  />
                </div>
              </div>
            ) : row.receiptUnavailable ? (
              <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 font-semibold">
                <ReceiptText size={12} />
                Proof unavailable
              </div>
            ) : (
              <span className="text-xs text-[var(--text-muted)]">No proof uploaded</span>
            )}
          </div>
        </div>

        <div className="md:col-span-3 border-t border-[var(--border-subtle)] pt-4">
          <button type="button" onClick={() => setInvoiceBookingId(row.id)} className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--bg-action-hover)]">
            <ReceiptText size={13} /> Preview invoice
          </button>
        </div>
      </div>
    );
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      sortValue: (row: BookingItem) => row.id,
      render: (row: BookingItem) => <span className="font-semibold text-[var(--text-muted)]">#{row.id}</span>,
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      sortValue: (row: BookingItem) => `${row.customerName} ${row.customerEmail || ''} ${row.customerPhone || ''} ${row.fieldName}`,
      render: (row: BookingItem) => (
        <div className="space-y-0.5">
          <p className="font-semibold text-[var(--text-primary)]">{row.customerName || '—'}</p>
          <p className="text-xs text-[var(--text-muted)] font-medium">{row.fieldName}</p>
        </div>
      ),
    },
    {
      key: 'schedule',
      label: 'Date',
      sortable: true,
      sortValue: (row: BookingItem) => row.booking_date,
      render: (row: BookingItem) => (
        <div className="space-y-0.5">
          <div className="font-medium text-[var(--text-primary)]">{row.booking_date}</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">
            {row.start_time.slice(0, 5)} - {row.end_time.slice(0, 5)}
          </div>
        </div>
      ),
    },
    {
      key: 'payment',
      label: 'Payment',
      sortable: true,
      sortValue: (row: BookingItem) => row.price,
      render: (row: BookingItem) => (
        <div className="space-y-0.5 font-medium">
          <div className="text-[var(--text-primary)]">{money.format(row.price)}</div>
          <div className="text-xs text-[var(--accent-blue)]">
            DP: {money.format(row.dp_amount)}
          </div>
        </div>
      ),
    },
    {
      key: 'receipt',
      label: 'Payment proof',
      sortable: false,
      render: (row: BookingItem) => {
        if (row.receiptUrl) {
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(row.receiptUrl);
              }}
              className="relative h-10 w-16 overflow-hidden rounded border border-[var(--border-subtle)] bg-[var(--bg-body)] hover:opacity-80 transition cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={row.receiptUrl}
              alt="Payment proof"
                className="h-full w-full object-cover"
              />
            </button>
          );
        }
        if (row.receiptUnavailable) {
          return (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Unavailable
            </span>
          );
        }
        return <span className="text-xs text-[var(--text-muted)]">—</span>;
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (row: BookingItem) => row.status,
      render: (row: BookingItem) => <StatusBadge status={row.status} />,
    },
      {
        key: 'actions',
      label: 'Actions',
        render: (row: BookingItem) => (
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setInvoiceBookingId(row.id)} className="inline-flex h-7 items-center rounded-[4px] border border-[var(--border-subtle)] px-2.5 text-[0.8rem] font-medium hover:bg-[var(--bg-action-hover)]">Preview invoice</button>
          {row.status === 'pending' && (
            <BookingActionForm
              action={approveDPFormAction}
              bookingId={row.id}
              label="Approve deposit proof"
              pendingLabel="..."
              tone="approve"
              description={`Approve the deposit proof for booking #${row.id}. The customer can submit the final payment proof after this approval.`}
            />
          )}
          {row.status === 'dp_paid' && (
            <BookingActionForm
              action={completePaymentOfflineFormAction}
              bookingId={row.id}
              label="Record offline payment"
              pendingLabel="..."
              tone="approve"
              description={`Record booking #${row.id} as paid through an offline payment. This status cannot be reversed from this page.`}
            />
          )}
          {row.status === 'payment_2_pending' && (
            <BookingActionForm
              action={approveFinalPaymentFormAction}
              bookingId={row.id}
              label="Approve final proof"
              pendingLabel="..."
              tone="approve"
              description={`Approve the final payment proof for booking #${row.id}. The booking will be marked as paid and confirmed.`}
            />
          )}
          {!['cancelled', 'confirmed'].includes(row.status) && (
            <BookingActionForm
              action={cancelBookingFormAction}
              bookingId={row.id}
              label="Cancel booking"
              pendingLabel="..."
              tone="danger"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {loadError ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200"
        >
          {loadError}
        </div>
      ) : null}

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-card)] text-[var(--text-secondary)] ring-1 ring-[var(--border-subtle)]">
            <Calendar size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Booking list</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {visibleBookings.length || filtered.length} of {bookings.length} bookings visible
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="-mx-1 overflow-x-auto px-1 pb-1 xl:mx-0 xl:px-0">
            <div className="flex w-max items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStatusFilter('review')}
                className={`inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === 'review'
                    ? 'border-amber-500/50 bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    : 'border-amber-500/25 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300'
                }`}
              >
                <ClipboardCheck size={13} /> Needs review ({reviewCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('')}
                className={`rounded-[4px] px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${
                  statusFilter === ''
                    ? 'bg-[var(--text-primary)] text-[var(--bg-card)] border-transparent'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-action-hover)]'
                }`}
              >
                All statuses
              </button>
              {STATUS_OPTIONS.map((s) => {
                const isActive = statusFilter === s;
                let activeStyle = '';
                switch (s) {
                  case 'pending': activeStyle = 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50'; break;
                  case 'dp_paid': activeStyle = 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/50'; break;
                  case 'payment_2_pending': activeStyle = 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/50'; break;
                  case 'paid':
                  case 'confirmed': activeStyle = 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50'; break;
                  case 'cancelled': activeStyle = 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/50'; break;
                  default: activeStyle = 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/50';
                }

                return <button key={s} type="button" onClick={() => setStatusFilter(s)} className={`whitespace-nowrap rounded-[4px] px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${isActive ? activeStyle : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-action-hover)]'}`}>
                  {({ pending: 'Pending verification', dp_paid: 'Deposit approved', payment_2_pending: 'Final verification', paid: 'Paid', confirmed: 'Confirmed', cancelled: 'Cancelled' } as Record<string, string>)[s]}
                </button>;
              })}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-1 xl:items-end">
          <button
            type="button"
            onClick={printTransactionReport}
            className="inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--text-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--bg-card)] transition hover:opacity-85"
          >
            <Download size={13} /> Export {reportRows.length} transactions
          </button>
          <span className="text-[11px] text-[var(--text-muted)] xl:text-right">The PDF follows the active status, date range, search, and sort order.</span>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          expandableRender={renderDetails}
          dateValue={(row) => row.booking_date}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onFilteredDataChange={handleFilteredDataChange}
          copy={{ showEntries: 'Show', entries: 'entries', fromDate: 'From date', toDate: 'To date', search: 'Search', noRecords: 'No bookings found', noRecordsHint: 'Try changing the search, filters, or page size.', showing: 'Showing', to: 'to', of: 'of', previous: 'Previous', next: 'Next' }}
        />
      </div>

      <InvoicePreview bookingId={invoiceBookingId} open={invoiceBookingId !== null} onOpenChange={(open) => { if (!open) setInvoiceBookingId(null); }} />

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-slate-900 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Payment proof preview"
              className="max-h-[80vh] max-w-[85vw] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
