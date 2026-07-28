'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, History, ReceiptText } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import { StatusBadge } from '@/components/StatusBadge';
import { BookingCalendar } from '@/components/BookingCalendar';
import { QuickActions } from '@/components/quick-actions';
import { DashboardStats } from '@/components/stats';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  userName: string;
  stats: {
    total: number;
    waiting: number;
    confirmed: number;
    cancelled: number;
    totalSpending: number;
    successfulCount: number;
  };
  recentBookings: {
    id: number;
    fieldName: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    price: number;
    status: string;
  }[];
  calendarBookings: { booking_date: string; status: string }[];
};

const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

function getGreeting(t: (key: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('dashboard.greeting.morning');
  if (hour < 17) return t('dashboard.greeting.afternoon');
  return t('dashboard.greeting.evening');
}

export function CustomerDashboardClient({ userName, stats, recentBookings, calendarBookings }: Props) {
  const { t, locale } = useTranslation();

  const statItems = [
    { label: t('dashboard.totalBooking'), value: stats.total },
    { label: t('dashboard.waiting'), value: stats.waiting },
    { label: t('dashboard.confirmed'), value: stats.confirmed },
    { label: t('dashboard.cancelled'), value: stats.cancelled },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="col-span-full flex flex-col gap-4 pb-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground" suppressHydrationWarning>
            {getGreeting(t)} {t('dashboard.greeting.emoji')}
          </p>
          <h1 className="mt-1 truncate text-balance text-2xl font-semibold tracking-tight">{userName}</h1>
          <p className="mt-1 text-sm text-muted-foreground" suppressHydrationWarning>
            {new Date().toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button asChild>
          <Link href="/customer/booking/create"><Calendar data-icon="inline-start" /> {t('dashboard.bookNow')}</Link>
        </Button>
      </div>

      <DashboardStats
        stats={statItems.map((item) => ({
          label: item.label,
          value: String(item.value),
          hint: item.label === t('dashboard.waiting') ? t('dashboard.needsAction') : t('dashboard.allBookingHistory'),
        }))}
      />

      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <div>
            <CardTitle>{t('dashboard.bookingActivity')}</CardTitle>
            <CardDescription>{t('dashboard.recentFive')}</CardDescription>
          </div>
          <CardAction>
            <Button asChild size="sm" variant="ghost">
              <Link href="/customer/history">{t('dashboard.viewAll')}</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">{t('dashboard.noBookings')}</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentBookings.map((booking) => (
                <li key={booking.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{booking.fieldName}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground tabular-nums" suppressHydrationWarning>
                      {booking.booking_date} · {booking.start_time.slice(0, 5)}–{booking.end_time.slice(0, 5)} · {money.format(booking.price)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/invoice/${booking.id}`} aria-label={`View invoice for ${booking.fieldName}`}><ReceiptText /></Link>
                    </Button>
                    <StatusBadge status={booking.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <BookingCalendar bookings={calendarBookings} className="md:col-span-2 lg:col-span-2" />

      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>{t('dashboard.totalSpending')}</CardTitle>
          <CardDescription>{t('dashboard.fromBookings', { count: stats.successfulCount })}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{money.format(stats.totalSpending)}</p>
        </CardContent>
        <CardFooter className="border-t">
          <Button asChild size="sm" variant="ghost">
            <Link href="/customer/history">{t('dashboard.viewHistory')} <ArrowRight data-icon="inline-end" /></Link>
          </Button>
        </CardFooter>
      </Card>

      <QuickActions
        className="md:col-span-2 lg:col-span-2"
        title={t('dashboard.quickActions')}
        description={t('dashboard.quickActionsDesc')}
        actions={[
          { title: t('dashboard.bookNow'), description: t('dashboard.createBookingDesc'), href: '/customer/booking/create', icon: Calendar },
          { title: t('dashboard.history'), description: t('dashboard.trackPaymentDesc'), href: '/customer/history', icon: History },
        ]}
      />
    </div>
  );
}
