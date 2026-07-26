'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type BookingCalendarProps = {
  bookings: { booking_date: string; status: string }[];
  className?: string;
};

const statusDotColor: Record<string, string> = {
  pending: 'bg-amber-400',
  dp_paid: 'bg-purple-400',
  payment_2_pending: 'bg-purple-400',
  paid: 'bg-emerald-400',
  confirmed: 'bg-emerald-400',
  cancelled: 'bg-red-400',
};

const DAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAYS_ID = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { day: number; currentMonth: boolean; dateStr: string }[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    days.push({ day: d, currentMonth: false, dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      currentMonth: true,
      dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // Fill to complete last row
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    const nextMonth = month + 2 > 12 ? 1 : month + 2;
    const nextYear = month + 2 > 12 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, currentMonth: false, dateStr: `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
    }
  }

  return days;
}

export function BookingCalendar({ bookings, className }: BookingCalendarProps) {
  const { t, locale } = useTranslation();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [view, setView] = useState<'month' | 'week'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const dayLabels = locale === 'id' ? DAYS_ID : DAYS_EN;
  const monthLabels = locale === 'id' ? MONTHS_ID : MONTHS_EN;

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Build booking map: dateStr → status[]
  const bookingMap = new Map<string, string[]>();
  bookings.forEach((b) => {
    const existing = bookingMap.get(b.booking_date) ?? [];
    existing.push(b.status);
    bookingMap.set(b.booking_date, existing);
  });

  const allDays = getCalendarDays(year, month);

  // For week view: only show the week containing today
  const weekDays = view === 'week'
    ? (() => {
        const todayIdx = allDays.findIndex((d) => d.dateStr === todayStr);
        const idx = todayIdx >= 0 ? todayIdx : allDays.findIndex((d) => d.currentMonth);
        const startOfWeek = idx - (idx % 7);
        return allDays.slice(startOfWeek, startOfWeek + 7);
      })()
    : allDays;

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

  return (
    <Card className={cn('gap-0', className)} id="booking-calendar">
      <CardHeader>
        <CardTitle>{t('dashboard.bookingCalendar')}</CardTitle>
        <CardAction>
          <Button type="button" size="sm" variant="outline" onClick={() => setView(view === 'month' ? 'week' : 'month')}>
            {t(`dashboard.${view === 'month' ? 'week' : 'month'}`)}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>

      {/* Navigation */}
      <div className="mb-5 flex items-center justify-between">
        <Button type="button" size="icon" variant="outline" onClick={goToPrevMonth} aria-label={t('common.previous')}>
          <ChevronLeft />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" suppressHydrationWarning>{monthLabels[month]} {year}</span>
          <Button type="button" size="xs" variant="secondary" onClick={goToToday}>
            {t('dashboard.today')}
          </Button>
        </div>
        <Button type="button" size="icon" variant="outline" onClick={goToNextMonth} aria-label={t('common.next')}>
          <ChevronRight />
        </Button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {dayLabels.map((day) => (
          <div key={day} className="py-1 text-center text-xs font-medium uppercase tracking-[0.02em] text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((d, i) => {
          const isToday = d.dateStr === todayStr;
          const statuses = bookingMap.get(d.dateStr) ?? [];

          return (
            <div
              key={`${d.dateStr}-${i}`}
              suppressHydrationWarning
              className={cn(
                'relative flex min-h-11 flex-col items-center justify-start rounded-md p-1.5 text-xs text-muted-foreground hover:bg-muted',
                !d.currentMonth && 'opacity-30',
                isToday && 'bg-primary/10 font-semibold text-primary ring-1 ring-primary/30',
              )}
            >
              <span>{d.day}</span>
              {statuses.length > 0 && (
                <div className="mt-1 flex gap-0.5">
                  {statuses.slice(0, 3).map((s, si) => (
                    <span key={si} className={`h-1.5 w-1.5 rounded-full ${statusDotColor[s] ?? 'bg-gray-400'}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 border-t pt-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-xs text-muted-foreground">{t('dashboard.pending')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-purple-400" />
          <span className="text-xs text-muted-foreground">{t('dashboard.dpPaid')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-muted-foreground">{t('dashboard.confirmedDot')}</span>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
