'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Booking = { booking_date: string; status: string; fieldName?: string; start_time?: string; end_time?: string };
type BookingCalendarProps = { bookings: Booking[]; className?: string; variant?: 'full' | 'compact' };

const dotColor: Record<string, string> = {
  pending: 'bg-amber-500', dp_paid: 'bg-amber-500', payment_2_pending: 'bg-amber-500',
  paid: 'bg-emerald-500', confirmed: 'bg-emerald-500', cancelled: 'bg-destructive',
};

function monthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: first + count }, (_, index) => {
    const day = index - first + 1;
    return day > 0 ? { day, date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` } : null;
  });
}

export function BookingCalendar({ bookings, className, variant = 'compact' }: BookingCalendarProps) {
  const { t, locale } = useTranslation();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const todayKey = today.toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(() => bookings.some((booking) => booking.booking_date === todayKey) ? todayKey : bookings[0]?.booking_date ?? todayKey);
  const map = new Map<string, Booking[]>();
  bookings.forEach((booking) => map.set(booking.booking_date, [...(map.get(booking.booking_date) ?? []), booking]));
  const month = currentDate.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });
  const dayLabels = locale === 'id' ? ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'] : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const isFull = variant === 'full';
  const selected = map.get(selectedDate) ?? [];
  const changeMonth = (offset: number) => setCurrentDate((value) => new Date(value.getFullYear(), value.getMonth() + offset, 1));

  return (
    <TooltipProvider>
      <Card className={cn('gap-0', className)} id="booking-calendar">
        <CardHeader className={cn(isFull && 'border-b pb-4')}>
          <CardTitle>{isFull ? t('dashboard.bookingCalendar') : month}</CardTitle>
          <div className="flex items-center gap-1">
            <Button type="button" size="icon-xs" variant="ghost" onClick={() => changeMonth(-1)} aria-label={t('common.previous')}><ChevronLeft /></Button>
            {isFull ? <Button type="button" size="sm" variant="outline" onClick={() => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))}>{t('dashboard.today')}</Button> : null}
            <Button type="button" size="icon-xs" variant="ghost" onClick={() => changeMonth(1)} aria-label={t('common.next')}><ChevronRight /></Button>
          </div>
        </CardHeader>
        <CardContent className={cn('pt-4', isFull && 'p-0')}>
          {isFull ? <div className="px-4 pt-4 text-xl font-medium tracking-tight">{month}</div> : null}
          <div className={cn('mt-4 grid grid-cols-7', isFull && 'mt-4 border-t border-border')}>
            {dayLabels.map((label) => <div key={label} className={cn('py-2 text-center text-[10px] font-medium tracking-widest text-muted-foreground', isFull && 'border-r border-border last:border-r-0')}>{label}</div>)}
            {monthDays(currentDate).map((item, index) => {
              if (!item) return <div key={`empty-${index}`} className={cn('min-h-12', isFull && 'min-h-35 border-r border-t border-border last:border-r-0')} />;
              const dayBookings = map.get(item.date) ?? [];
              const selectedDay = item.date === selectedDate;
              const isToday = item.date === todayKey;
              const label = dayBookings.map((booking) => `${booking.fieldName ?? t('dashboard.bookingCalendar')} ${booking.start_time?.slice(0, 5) ?? ''}–${booking.end_time?.slice(0, 5) ?? ''}`).join('\n');
              const day = <button type="button" onClick={() => setSelectedDate(item.date)} className={cn('flex w-full flex-col items-center p-2 text-xs transition-colors hover:bg-muted', isFull ? 'min-h-35 items-start' : 'min-h-12', selectedDay && 'bg-muted', isToday && 'font-semibold')}>
                <span className={cn('grid size-6 place-items-center rounded-full', isToday && 'bg-primary text-primary-foreground')}>{item.day}</span>
                {isFull ? <div className="mt-2 flex w-full flex-col gap-1">{dayBookings.slice(0, 3).map((booking, bookingIndex) => <span key={bookingIndex} className="truncate rounded-sm border border-current/20 bg-muted px-1.5 py-0.5 text-left text-[10px] text-muted-foreground">{booking.fieldName ?? t(`status.${booking.status}`)} · {booking.start_time?.slice(0, 5)}</span>)}</div> : <div className="mt-1 flex gap-0.5">{dayBookings.slice(0, 3).map((booking, bookingIndex) => <span key={bookingIndex} className={cn('size-1 rounded-full', dotColor[booking.status] ?? 'bg-muted-foreground')} />)}</div>}
              </button>;
              return <Tooltip key={item.date}><TooltipTrigger asChild>{day}</TooltipTrigger>{dayBookings.length ? <TooltipContent className="whitespace-pre-line">{label}</TooltipContent> : null}</Tooltip>;
            })}
          </div>
          {!isFull ? <div className="mt-4 border-t pt-4"><p className="text-[10px] font-medium tracking-[0.3em] text-muted-foreground">{new Date(`${selectedDate}T00:00:00`).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}</p><div className="mt-3 flex flex-col gap-2">{selected.length ? selected.map((booking, index) => <div key={index} className="flex items-center gap-2 text-sm"><span className={cn('size-1.5 rounded-full', dotColor[booking.status] ?? 'bg-muted-foreground')} /><span className="tabular-nums text-muted-foreground">{booking.start_time?.slice(0, 5)}</span><span className="truncate">{booking.fieldName ?? t(`status.${booking.status}`)}</span></div>) : <p className="text-sm text-muted-foreground">{t('dashboard.noBookings')}</p>}</div></div> : null}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
