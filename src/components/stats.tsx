import {
  Stat,
  StatDescription,
  StatIndicator,
  StatLabel,
  StatSeparator,
  StatValue,
} from '@/components/ui/stat';
import type { LucideIcon } from 'lucide-react';

export type DashboardStat = {
  label: string;
  value: string;
  hint: string;
  icon?: LucideIcon;
  tone?: 'default' | 'success' | 'info' | 'warning' | 'error';
};

export function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  return stats.map((stat, index) => {
    const labelId = `dashboard-stat-${index}`;
    return (
      <Stat key={stat.label} role="group" aria-labelledby={labelId} className="min-h-37.5">
        <StatLabel id={labelId}>{stat.label}</StatLabel>
        {stat.icon ? <StatIndicator variant="icon" color={stat.tone}><stat.icon /></StatIndicator> : null}
        <StatValue className="tabular-nums">{stat.value}</StatValue>
        <StatSeparator />
        <StatDescription className="truncate">{stat.hint}</StatDescription>
      </Stat>
    );
  });
}
