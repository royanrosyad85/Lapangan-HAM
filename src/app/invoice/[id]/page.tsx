import Image from 'next/image';
import { notFound } from 'next/navigation';

import { InvoiceClient } from './InvoiceClient';
import { invoiceNumber, paymentStageLabel, paymentStatusLabel, type InvoicePayment } from '@/lib/invoice';
import { createClient } from '@/lib/supabase/server';

type Booking = {
  id: number;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  price: number | string;
  dp_amount: number | string;
  status: string;
  created_at: string;
  addons: { total?: number } | null;
  fields: { name: string } | { name: string }[] | null;
  profiles: { name: string | null; email: string | null } | { name: string | null; email: string | null }[] | null;
  payments: InvoicePayment[] | null;
};

const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookingId = Number(id);
  if (!Number.isInteger(bookingId) || bookingId <= 0) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const { data } = await supabase
    .from('bookings')
    .select('id, user_id, booking_date, start_time, end_time, price, dp_amount, status, created_at, addons, fields(name), profiles(name, email), payments(amount, payment_type, status, created_at, receipt_url)')
    .eq('id', bookingId)
    .maybeSingle();
  const booking = data as Booking | null;

  if (!booking || (profile?.role !== 'admin' && booking.user_id !== user.id)) notFound();

  const payments = await Promise.all((booking.payments ?? []).map(async (payment) => {
    if (!payment.receipt_url) return { ...payment, proofUrl: null };
    const { data: signed } = await supabase.storage.from('payment-proofs').createSignedUrl(payment.receipt_url, 60 * 10);
    return { ...payment, proofUrl: signed?.signedUrl ?? null };
  }));
  const field = Array.isArray(booking.fields) ? booking.fields[0] : booking.fields;
  const customer = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles;
  const total = Number(booking.price);
  const dp = Number(booking.dp_amount);
  const addOnTotal = Number(booking.addons?.total ?? 0);
  const fieldTotal = Math.max(0, total - addOnTotal);
  const number = invoiceNumber(booking.created_at, booking.id);

  return (
    <InvoiceClient invoiceNumber={number}>
      <header className="flex items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-3">
          <Image src="/assets/icon.svg" alt="HAM Stadium Booking" width={52} height={52} priority />
          <div>
            <p className="font-semibold">HAM Stadium Booking</p>
            <p className="text-sm text-[var(--text-muted)]">Stadion H. Abdul Malik</p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-semibold tracking-tight">Invoice</h1>
          <p className="mt-1 text-sm font-medium">{number}</p>
        </div>
      </header>

      <section className="grid gap-6 py-6 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)]">Billed to</p>
          <p className="mt-1 font-medium">{customer?.name || 'Customer'}</p>
          <p className="text-[var(--text-muted)]">{customer?.email || '-'}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-medium text-[var(--text-muted)]">Booking status</p>
          <p className="mt-1 font-medium">{paymentStatusLabel(booking.status)}</p>
          <p className="text-[var(--text-muted)]">Issued {new Date(booking.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </section>

      <section className="border-y border-[var(--border-subtle)] py-5">
        <div className="flex items-start justify-between gap-4 text-sm">
          <div>
            <p className="font-medium">{field?.name || 'HAM Field'}</p>
            <p className="mt-1 text-[var(--text-muted)]">{booking.booking_date} · {booking.start_time.slice(0, 5)}–{booking.end_time.slice(0, 5)}</p>
          </div>
          <span className="font-medium tabular-nums">{money.format(fieldTotal)}</span>
        </div>
        {addOnTotal > 0 && (
          <div className="mt-4 flex justify-between gap-4 text-sm">
            <span className="text-[var(--text-muted)]">Booking add-ons</span>
            <span className="font-medium tabular-nums">{money.format(addOnTotal)}</span>
          </div>
        )}
      </section>

      <section className="ml-auto mt-6 max-w-sm space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-[var(--text-muted)]">Total</span><span className="font-medium tabular-nums">{money.format(total)}</span></div>
        <div className="flex justify-between"><span className="text-[var(--text-muted)]">Deposit (DP)</span><span className="font-medium tabular-nums">{money.format(dp)}</span></div>
        <div className="flex justify-between border-t border-[var(--border-subtle)] pt-3 text-base"><span className="font-semibold">Remaining</span><span className="font-semibold tabular-nums">{money.format(Math.max(0, total - dp))}</span></div>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold">Payment record</h2>
        {payments.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">No payment proof has been submitted.</p>
        ) : (
          <div className="mt-3 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {payments.map((payment) => (
              <div key={`${payment.payment_type}-${payment.created_at}`} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div><p className="font-medium">{paymentStageLabel(payment.payment_type)}</p><p className="text-[var(--text-muted)]">{paymentStatusLabel(payment.status)}</p></div>
                  <span className="font-medium tabular-nums">{money.format(Number(payment.amount))}</span>
                </div>
                {payment.proofUrl && (
                  // Signed URLs are issued only after ownership/admin authorization above.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={payment.proofUrl} alt={`${paymentStageLabel(payment.payment_type)} transfer proof`} className="mt-3 max-h-72 max-w-full rounded-lg border border-[var(--border-subtle)] object-contain" />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </InvoiceClient>
  );
}
