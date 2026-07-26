import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export type DashboardStat = {
  label: string;
  value: string;
  hint: string;
};

export function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  return stats.map((stat, index) => {
    const labelId = `dashboard-stat-${index}`;
    return (
      <Card key={stat.label} role="group" aria-labelledby={labelId} className="gap-0 py-0">
        <CardHeader className="px-4 pt-4 pb-2">
          <p id={labelId} className="text-xs font-normal text-muted-foreground">{stat.label}</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-balance text-2xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
        </CardContent>
        <CardFooter className="min-h-9 border-t bg-muted/35 px-4 py-2 text-xs text-muted-foreground">
          <span className="truncate">{stat.hint}</span>
        </CardFooter>
      </Card>
    );
  });
}
