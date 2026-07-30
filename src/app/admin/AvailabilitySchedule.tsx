'use client';

import { CalendarDays, ChevronLeft, ChevronRight, CircleCheck, CircleX, Clock3 } from 'lucide-react';
import { useState } from 'react';

import { BOOKING_PRICE_SLOTS, calculateBookingPrice } from '@/config/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Field = { id: number; name: string; status: string };
type Booking = { field_id: number; booking_date: string; start_time: string; end_time: string; status: string; customerName?: string };

const rupiah = new Intl.NumberFormat('id-ID');

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function atMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function AvailabilitySchedule({ fields, bookings }: { fields: Field[]; bookings: Booking[] }) {
  const activeFields = fields.filter((field) => field.status === 'active');
  const [fieldId, setFieldId] = useState(String(activeFields[0]?.id ?? ''));
  const [weekOffset, setWeekOffset] = useState(0);
  const start = atMidnight(new Date());
  const today = localDate(start);
  start.setDate(start.getDate() + weekOffset * 7);
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });

  const booked = (date: string, startHour: number, endHour: number) => bookings.find((booking) => {
    if (booking.status === 'cancelled' || booking.field_id !== Number(fieldId) || booking.booking_date !== date) return false;
    const bookingStart = Number(booking.start_time.split(':')[0]);
    const bookingEnd = Number(booking.end_time.split(':')[0]);
    return Math.max(startHour, bookingStart) < Math.min(endHour, bookingEnd);
  });
  const range = `${dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <Card className="col-span-full overflow-hidden border-[var(--border-subtle)] bg-[var(--bg-card)]">
      <CardHeader className="gap-5 border-b border-[var(--border-subtle)] bg-[linear-gradient(120deg,var(--bg-card),var(--bg-body))] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--text-primary)] text-[var(--bg-card)]">
            <CalendarDays size={18} />
          </span>
          <div>
            <CardTitle className="text-lg">Field availability</CardTitle>
            <CardDescription className="mt-1">A seven-day view of bookable hours and blocked slots.</CardDescription>
            <p className="mt-3 text-xs font-medium tabular-nums text-[var(--text-secondary)]">{range}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1">
            <Button variant="ghost" size="icon" onClick={() => setWeekOffset((offset) => offset - 1)} aria-label="Previous week"><ChevronLeft /></Button>
            <Button variant="ghost" size="icon" onClick={() => setWeekOffset((offset) => offset + 1)} aria-label="Next week"><ChevronRight /></Button>
          </div>
          <Select value={fieldId} onValueChange={setFieldId} disabled={!activeFields.length}>
            <SelectTrigger className="h-10 w-52 bg-[var(--bg-card)]"><SelectValue placeholder="Select a field" /></SelectTrigger>
            <SelectContent>{activeFields.map((field) => <SelectItem key={field.id} value={String(field.id)}>{field.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {!fieldId ? <p className="p-6 text-sm text-muted-foreground">No active fields are available.</p> : (
          <div className="overflow-x-auto px-5 py-5 md:px-6">
            <div className="mb-4 flex min-w-[1232px] items-center gap-4 text-xs text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1.5"><CircleCheck size={14} className="text-emerald-600" /> Available</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-amber-600" /> Booked</span>
              <span className="inline-flex items-center gap-1.5"><CircleX size={14} className="text-[var(--text-muted)]" /> Closed</span>
            </div>
            <div className="grid min-w-[1232px] grid-cols-7 gap-2.5">
              {dates.map((date) => {
                const dateString = localDate(date);
                const isToday = dateString === today;
                return <div key={dateString} className={`rounded-2xl border p-2.5 ${isToday ? 'border-[var(--accent-lime)] bg-[var(--bg-card)] ring-1 ring-[var(--accent-lime)]/35' : 'border-[var(--border-subtle)] bg-[var(--bg-body)]'}`}>
                  <div className="flex min-h-11 items-center justify-between px-1">
                    <p className="text-sm font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</p>
                    <span className={`text-[11px] font-medium ${isToday ? 'rounded-full bg-[var(--text-primary)] px-2 py-0.5 text-[var(--bg-card)]' : 'text-[var(--text-muted)]'}`}>{isToday ? 'Today' : date.toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div className="space-y-1.5">
                    {BOOKING_PRICE_SLOTS.map((slot) => {
                      const closed = date.getDay() >= 1 && date.getDay() <= 4 ? slot.weekdayPrice === null : date.getDay() === 5 ? slot.fridayPrice === null : false;
                      const booking = booked(dateString, slot.startHour, slot.endHour);
                      const isBooked = Boolean(booking);
                      const time = `${String(slot.startHour).padStart(2, '0')}.00 - ${String(slot.endHour).padStart(2, '0')}.00`;
                      const price = calculateBookingPrice(date, slot.startHour, slot.endHour).total;
                      const stateClass = closed
                        ? 'border-transparent bg-[var(--bg-action-hover)] text-[var(--text-muted)]'
                        : isBooked
                          ? 'border-amber-500/25 bg-amber-500/10 text-[var(--text-secondary)]'
                          : 'border-emerald-500/25 bg-[var(--bg-card)] text-[var(--text-primary)] hover:-translate-y-0.5 hover:border-emerald-500/50';
                      const slotCard = <div className={`min-h-[58px] rounded-xl border px-2.5 py-2 transition-[transform,border-color] duration-200 ${stateClass}`}>
                        <p className="text-xs font-semibold tabular-nums">{time}</p>
                        <p className="mt-1 text-[11px] font-medium">{closed ? 'Closed' : isBooked ? 'Booked' : `Rp${rupiah.format(price)}`}</p>
                      </div>;
                      return isBooked ? <Tooltip key={slot.startHour}>
                        <TooltipTrigger asChild><button type="button" className="block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">{slotCard}</button></TooltipTrigger>
                        <TooltipContent sideOffset={6}>Booked by {booking?.customerName || 'Unknown customer'}</TooltipContent>
                      </Tooltip> : <div key={slot.startHour}>{slotCard}</div>;
                    })}
                  </div>
                </div>;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
