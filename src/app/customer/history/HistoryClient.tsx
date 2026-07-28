'use client';

import { useState } from 'react';
import Link from 'next/link';
import { History, ReceiptText } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BookingItem = { id: number; fieldName: string; booking_date: string; start_time: string; end_time: string; price: number; dp_amount: number; status: string };
const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const statuses = ['pending', 'dp_paid', 'payment_2_pending', 'paid', 'confirmed', 'cancelled'];

export function HistoryClient({ bookings }: { bookings: BookingItem[] }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');
  const visibleBookings = status ? bookings.filter((booking) => booking.status === status) : bookings;
  const columns = [
    { key: 'field', label: t('admin.fieldCol'), sortable: true, sortValue: (booking: BookingItem) => booking.fieldName, render: (booking: BookingItem) => <span className="font-medium">{booking.fieldName}</span> },
    { key: 'schedule', label: t('admin.dateCol'), sortable: true, sortValue: (booking: BookingItem) => booking.booking_date, render: (booking: BookingItem) => <div className="tabular-nums"><p>{booking.booking_date}</p><p className="text-xs text-muted-foreground">{booking.start_time.slice(0, 5)}-{booking.end_time.slice(0, 5)}</p></div> },
    { key: 'price', label: t('booking.totalPrice'), sortable: true, sortValue: (booking: BookingItem) => booking.price, render: (booking: BookingItem) => <span className="font-medium tabular-nums">{money.format(booking.price)}</span> },
    { key: 'status', label: t('admin.statusCol'), sortable: true, sortValue: (booking: BookingItem) => booking.status, render: (booking: BookingItem) => <StatusBadge status={booking.status} /> },
    { key: 'action', label: t('admin.actions'), render: (booking: BookingItem) => <div className="flex gap-2"><Button asChild size="sm" variant="outline"><Link href={`/invoice/${booking.id}`}><ReceiptText data-icon="inline-start" />Invoice</Link></Button>{booking.status === 'dp_paid' ? <Button asChild size="sm"><Link href={`/customer/booking/${booking.id}/pelunasan`}>{t('history.completePayment')}</Link></Button> : null}</div> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg border bg-card text-muted-foreground"><History /></div>
        <div><h1 className="text-balance text-2xl font-semibold tracking-tight">{t('history.title')}</h1><p className="mt-1 text-sm text-muted-foreground">{bookings.length} {t('common.entries')}</p></div>
      </div>
      {bookings.length === 0 ? <div className="rounded-xl border bg-card p-12 text-center text-sm text-muted-foreground">{t('history.noHistory')}</div> : <>
        <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? '' : value)}><SelectTrigger className="w-full sm:w-56"><SelectValue placeholder={t('common.allStatus')} /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">{t('common.allStatus')}</SelectItem>{statuses.map((item) => <SelectItem key={item} value={item}>{t(`status.${item}`)}</SelectItem>)}</SelectGroup></SelectContent></Select>
        <div className="hidden rounded-xl border bg-card p-4 md:block"><DataTable columns={columns} data={visibleBookings} keyExtractor={(booking) => booking.id} dateValue={(booking) => booking.booking_date} /></div>
        <div className="flex flex-col gap-3 md:hidden">{visibleBookings.map((booking) => <article key={booking.id} className="rounded-xl border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-medium">{booking.fieldName}</h2><p className="mt-1 text-sm text-muted-foreground tabular-nums">{booking.booking_date} · {booking.start_time.slice(0, 5)}-{booking.end_time.slice(0, 5)}</p></div><StatusBadge status={booking.status} /></div><div className="mt-4 flex items-center justify-between"><span className="font-medium tabular-nums">{money.format(booking.price)}</span><Button asChild size="sm" variant="outline"><Link href={`/invoice/${booking.id}`}>Invoice</Link></Button></div></article>)}</div>
      </>}
    </div>
  );
}
