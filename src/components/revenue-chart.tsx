'use client';

import { useId } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

export type RevenuePoint = {
  date: string;
  revenue: number;
};

type RevenueChartProps = {
  title: string;
  description: string;
  footer: string;
  rows: RevenuePoint[];
  formatValue: (value: number) => string;
  emptyLabel: string;
  seriesLabel: string;
  className?: string;
};

export function RevenueChart({ title, description, footer, rows, formatValue, emptyLabel, seriesLabel, className }: RevenueChartProps) {
  const gradientId = `revenue-${useId().replaceAll(':', '')}`;
  const chartConfig = {
    revenue: { label: seriesLabel, color: 'var(--chart-1)' },
  } satisfies ChartConfig;

  return (
    <Card className={cn('gap-0 py-0', className)}>
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 py-3 sm:px-4">
        {rows.length === 0 ? (
          <p className="flex h-60 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ChartContainer className="aspect-auto h-60 w-full" config={chartConfig}>
            <AreaChart accessibilityLayer data={rows} margin={{ left: 12, right: 12, top: 12 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="2 2" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} minTickGap={24} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value) => (
                      <div className="flex min-w-40 items-center justify-between gap-3">
                        <span className="text-muted-foreground">{seriesLabel}</span>
                        <span className="font-medium tabular-nums">{formatValue(Number(value))}</span>
                      </div>
                    )}
                  />
                }
              />
              <Area dataKey="revenue" dot={false} fill={`url(#${gradientId})`} stroke="var(--color-revenue)" strokeWidth={2} type="monotone" />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="min-h-10 border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">{footer}</CardFooter>
    </Card>
  );
}
