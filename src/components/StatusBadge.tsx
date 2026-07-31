'use client';

import { useTranslation } from '@/lib/i18n';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-700/85 border-amber-500/20 dark:text-amber-300/85',
  dp_paid: 'bg-cyan-500/10 text-cyan-700/85 border-cyan-500/20 dark:text-cyan-300/85',
  payment_2_pending: 'bg-purple-500/10 text-purple-700/85 border-purple-500/20 dark:text-purple-300/85',
  paid: 'bg-emerald-500/10 text-emerald-700/85 border-emerald-500/20 dark:text-emerald-300/85',
  confirmed: 'bg-emerald-500/10 text-emerald-700/85 border-emerald-500/20 dark:text-emerald-300/85',
  cancelled: 'bg-red-500/10 text-red-700/85 border-red-500/20 dark:text-red-300/85',
};

export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const style = statusStyles[status] ?? 'bg-gray-500/10 text-gray-600/85 border-gray-500/20 dark:text-gray-300/85';
  const label = t(`status.${status}`) || status;

  return (
    <span className={`inline-flex whitespace-nowrap rounded-[4px] border px-2 py-0.5 text-[11px] font-medium leading-5 ${style}`}>
      {label}
    </span>
  );
}
