'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, CheckCircle2, CircleDollarSign, MapPin, Plus, ReceiptText } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickActions } from '@/components/quick-actions';
import { RevenueChart } from '@/components/revenue-chart';
import { DashboardStats } from '@/components/stats';
import { BookingCalendar } from '@/components/BookingCalendar';
import { AvailabilitySchedule } from './AvailabilitySchedule';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type BookingRow = {
  id: number;
  field_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  price: number | string;
  fields: { name: string } | { name: string }[] | null;
  profiles: { name: string } | { name: string }[] | null;
};

type PaymentRow = {
  amount: number | string;
  status: string;
  created_at: string;
  bookings: {
    field_id: number;
    fields: {
      name: string;
    } | { name: string }[] | null;
  } | {
    field_id: number;
    fields: {
      name: string;
    } | { name: string }[] | null;
  }[] | null;
};

type FieldRow = {
  id: number;
  name: string;
  price: number | string;
  status: string;
};

type Props = {
  fields: FieldRow[];
  bookings: BookingRow[];
  payments: PaymentRow[];
};

const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

function getFieldIdFromPayment(p: PaymentRow): number | null {
  const booking = Array.isArray(p.bookings) ? p.bookings[0] : p.bookings;
  return booking?.field_id ?? null;
}

export function AdminDashboardClient({ fields, bookings, payments }: Props) {
  const { locale } = useTranslation();
  const [selectedFieldId, setSelectedFieldId] = useState<string>('all');

  const filteredBookings = bookings.filter((b) => {
    if (selectedFieldId === 'all') return true;
    return String(b.field_id) === selectedFieldId;
  });

  const filteredPayments = payments.filter((p) => {
    if (selectedFieldId === 'all') return true;
    return String(getFieldIdFromPayment(p)) === selectedFieldId;
  });

  // Calculate dynamic stats
  const totalBookingCount = filteredBookings.length;
  const pendingCount = filteredBookings.filter((b) => ['pending', 'payment_2_pending'].includes(b.status)).length;
  const confirmedCount = filteredBookings.filter((b) => ['confirmed', 'paid'].includes(b.status)).length;

  const approvedPayments = filteredPayments.filter((p) => p.status === 'approved');
  const dpRevenue = approvedPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRevenue = approvedPayments
    .filter((p) => p.created_at?.startsWith(todayStr))
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const thisMonthStr = todayStr.slice(0, 7);
  const thisMonthRevenue = approvedPayments
    .filter((p) => p.created_at?.startsWith(thisMonthStr))
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const last7Days = buildDailyRevenue(approvedPayments, 7);
  const last6Months = buildMonthlyRevenue(approvedPayments, 6, locale === 'id' ? 'id-ID' : 'en-US');

  // Chart wants chronological order (oldest -> newest) and a compact day label.
  const dailyChart = [...last7Days]
    .reverse()
    .map((row) => ({ date: row.date.slice(0, 5), revenue: row.revenue }));

  const todayLabel = new Date().toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const monthLabel = new Date().toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });

  const kpis = [
    { label: 'Total bookings', value: String(totalBookingCount), caption: 'All booking history', icon: CalendarCheck },
    { label: 'Pending review', value: String(pendingCount), caption: 'Needs your attention', icon: ReceiptText, tone: 'warning' as const },
    { label: 'Confirmed & paid', value: String(confirmedCount), caption: 'Completed booking history', icon: CheckCircle2, tone: 'success' as const },
    { label: 'Deposit revenue', value: money.format(dpRevenue), caption: 'Approved payments only', icon: CircleDollarSign, tone: 'info' as const },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <div className="col-span-full flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight">Operations dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Monitor booking demand, available field hours, and payment activity from one workspace.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
              <SelectItem value="all">All fields</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={String(field.id)}>{field.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button asChild variant="outline">
            <Link href="/admin/fields">Manage fields</Link>
          </Button>
        </div>
      </div>

      <DashboardStats stats={kpis.map((kpi) => ({ label: kpi.label, value: kpi.value, hint: kpi.caption, icon: kpi.icon, tone: kpi.tone }))} />

      <AvailabilitySchedule fields={fields} bookings={bookings.map((booking) => ({
        field_id: booking.field_id,
        booking_date: booking.booking_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status,
        customerName: Array.isArray(booking.profiles) ? booking.profiles[0]?.name : booking.profiles?.name,
      }))} />

      <div className="col-span-full grid items-start gap-4 xl:grid-cols-2">
        <BookingCalendar
          bookings={filteredBookings.map((booking) => ({
            booking_date: booking.booking_date,
            status: booking.status,
            fieldName: Array.isArray(booking.fields) ? booking.fields[0]?.name : booking.fields?.name,
            start_time: booking.start_time,
            end_time: booking.end_time,
          }))}
        />

        <RevenueChart
          title="Revenue in the last 7 days"
          description="Approved payments only"
          footer="Use the field filter to focus this report."
          rows={dailyChart}
          formatValue={(value) => money.format(value)}
          emptyLabel="No revenue data yet"
          seriesLabel="Revenue"
        />
      </div>

      <Card className="md:col-span-2 xl:col-span-2">
        <CardHeader>
          <CardTitle>Operational snapshot</CardTitle>
          <CardDescription>Current workload and approved revenue at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Pending review</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{pendingCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Today&apos;s revenue</p>
            <p className="mt-1 text-lg font-semibold tabular-nums" suppressHydrationWarning>{money.format(todayRevenue)}</p>
            <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>{todayLabel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">This month&apos;s revenue</p>
            <p className="mt-1 text-lg font-semibold tabular-nums" suppressHydrationWarning>{money.format(thisMonthRevenue)}</p>
            <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>{monthLabel}</p>
          </div>
        </CardContent>
        <CardFooter className="border-t">
          {pendingCount > 0 ? (
            <Button asChild size="sm">
              <Link href="/admin/bookings">Review payments <ArrowRight data-icon="inline-end" /></Link>
            </Button>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 /> All payments are verified</span>
          )}
        </CardFooter>
      </Card>

      <QuickActions
        className="md:col-span-2 xl:col-span-2"
        title="Quick actions"
        description="Jump directly to the next operational task."
        actions={[
          { title: 'Review payments', description: 'Process bookings waiting for verification.', href: '/admin/bookings', icon: CalendarCheck },
          { title: 'Manage fields', description: 'Update the fields customers can book.', href: '/admin/fields', icon: MapPin },
          { title: 'Add a field', description: 'Create a new field for online booking.', href: '/admin/fields/create', icon: Plus },
        ]}
      />

      <Card className="md:col-span-2 xl:col-span-4">
        <CardHeader>
          <CardTitle>Revenue by month</CardTitle>
          <CardDescription>Approved payments recorded in the last six months.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {last6Months.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="py-10 text-center text-muted-foreground">
                    No revenue data yet
                  </TableCell>
                </TableRow>
              ) : (
                last6Months.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums" suppressHydrationWarning>
                      {money.format(row.revenue)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function buildDailyRevenue(payments: PaymentRow[], limit: number) {
  const dailyMap: Record<string, number> = {};

  payments.forEach((p) => {
    if (!p.created_at) return;
    const datePart = typeof p.created_at === 'string' ? p.created_at.slice(0, 10) : new Date(p.created_at).toISOString().slice(0, 10);
    const [y, m, d] = datePart.split('-');
    const label = `${d}/${m}/${y}`;
    dailyMap[label] = (dailyMap[label] ?? 0) + Number(p.amount);
  });

  return Object.entries(dailyMap)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => {
      const [da, ma, ya] = a.date.split('/').map(Number);
      const [db, mb, yb] = b.date.split('/').map(Number);
      return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
    })
    .slice(0, limit);
}

function buildMonthlyRevenue(payments: PaymentRow[], limit: number, locale: string) {
  const monthlyMap: Record<string, { label: string; revenue: number }> = {};

  payments.forEach((p) => {
    if (!p.created_at) return;
    const datePart = typeof p.created_at === 'string' ? p.created_at.slice(0, 10) : new Date(p.created_at).toISOString().slice(0, 10);
    const [y, m] = datePart.split('-').map(Number);
    const dateObj = new Date(y, m - 1, 1);
    const key = `${y}-${String(m).padStart(2, '0')}`;
    const label = dateObj.toLocaleDateString(locale, { month: 'short', year: 'numeric' });

    if (!monthlyMap[key]) {
      monthlyMap[key] = { label, revenue: 0 };
    }
    monthlyMap[key].revenue += Number(p.amount);
  });

  return Object.keys(monthlyMap)
    .sort((a, b) => b.localeCompare(a))
    .map((key) => ({
      month: monthlyMap[key].label,
      revenue: monthlyMap[key].revenue,
    }))
    .slice(0, limit);
}
