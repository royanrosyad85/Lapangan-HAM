'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, CheckCircle2, MapPin, Plus } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickActions } from '@/components/quick-actions';
import { RevenueChart } from '@/components/revenue-chart';
import { DashboardStats } from '@/components/stats';
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
  status: string;
  price: number | string;
  fields: { name: string } | { name: string }[] | null;
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

export function AdminDashboardClient({ fields, bookings, payments }: Props) {
  const { t, locale } = useTranslation();
  const [selectedFieldId, setSelectedFieldId] = useState<string>('all');

  const filteredBookings = bookings.filter((b) => {
    if (selectedFieldId === 'all') return true;
    return String(b.field_id) === selectedFieldId;
  });

  const getFieldIdFromPayment = (p: PaymentRow): number | null => {
    const booking = Array.isArray(p.bookings) ? p.bookings[0] : p.bookings;
    return booking?.field_id ?? null;
  };

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

  const activeFieldLabel = selectedFieldId === 'all'
    ? `${fields.filter((f) => f.status === 'active').length}/${fields.length}`
    : fields.find((f) => String(f.id) === selectedFieldId)?.status === 'active'
      ? t('admin.active')
      : t('admin.inactive') || 'Inactive';

  const kpis = [
    { label: t('admin.fields'), value: activeFieldLabel, caption: t('admin.active') },
    { label: t('admin.totalBookingCount'), value: String(totalBookingCount), caption: t('dashboard.allBookingHistory') },
    { label: t('admin.dpRevenue'), value: money.format(dpRevenue), caption: t('admin.revenueApprovedDesc') },
    { label: t('admin.confirmedPaid'), value: String(confirmedCount), caption: t('dashboard.allBookingHistory') },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="col-span-full flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight">{t('admin.dashboardTitle')}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {t('admin.dashboardDescription')}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t('admin.allFields')}</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={String(field.id)}>{field.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button asChild variant="outline">
            <Link href="/admin/fields">{t('admin.fields')}</Link>
          </Button>
        </div>
      </div>

      <DashboardStats stats={kpis.map((kpi) => ({ label: kpi.label, value: kpi.value, hint: kpi.caption }))} />

      <RevenueChart
        className="md:col-span-2 lg:col-span-4"
        title={t('admin.last7Days')}
        description={t('admin.revenueApprovedDesc')}
        footer={t('admin.revenueFilterHint')}
        rows={dailyChart}
        formatValue={(value) => money.format(value)}
        emptyLabel={t('admin.noRevenueData')}
        seriesLabel={t('admin.revenueTrend')}
      />

      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>{t('admin.operationalSummary')}</CardTitle>
          <CardDescription>{t('admin.operationalSummaryDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">{t('admin.pendingVerification')}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{pendingCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('admin.todayRevenue')}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums" suppressHydrationWarning>{money.format(todayRevenue)}</p>
            <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>{todayLabel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('admin.thisMonthRevenue')}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums" suppressHydrationWarning>{money.format(thisMonthRevenue)}</p>
            <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>{monthLabel}</p>
          </div>
        </CardContent>
        <CardFooter className="border-t">
          {pendingCount > 0 ? (
            <Button asChild size="sm">
              <Link href="/admin/bookings">{t('admin.verifyPayments')} <ArrowRight data-icon="inline-end" /></Link>
            </Button>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 /> {t('admin.allClearTitle')}</span>
          )}
        </CardFooter>
      </Card>

      <QuickActions
        className="md:col-span-2 lg:col-span-2"
        title={t('admin.quickActions')}
        description={t('admin.quickActionsDesc')}
        actions={[
          { title: t('admin.verifyPayments'), description: t('admin.pendingBannerDesc'), href: '/admin/bookings', icon: CalendarCheck },
          { title: t('admin.fields'), description: t('admin.manageFieldsDesc'), href: '/admin/fields', icon: MapPin },
          { title: t('admin.addFieldAction'), description: t('admin.addFieldDesc'), href: '/admin/fields/create', icon: Plus },
        ]}
      />

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>{t('admin.last6Months')}</CardTitle>
          <CardDescription>{t('admin.monthlyReportDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t('admin.monthCol')}</TableHead>
                <TableHead className="text-right">{t('admin.revenueTrend')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {last6Months.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="py-10 text-center text-muted-foreground">
                    {t('admin.noRevenueData')}
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
