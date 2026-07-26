import {
  Stat,
  StatDescription,
  StatLabel,
  StatSeparator,
  StatValue,
} from '@/components/ui/stat';

export type DashboardStat = {
  label: string;
  value: string;
  hint: string;
};

export function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  return stats.map((stat, index) => {
    const labelId = `dashboard-stat-${index}`;
    return (
      <Stat key={stat.label} role="group" aria-labelledby={labelId}>
        <StatLabel id={labelId}>{stat.label}</StatLabel>
        <StatValue className="tabular-nums">{stat.value}</StatValue>
        <StatSeparator />
        <StatDescription className="truncate">{stat.hint}</StatDescription>
      </Stat>
    );
  });
}
