'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

import { AppBreadcrumbs } from '@/components/app-breadcrumbs';
import { getDashboardBreadcrumbs, type DashboardRole } from '@/components/app-shared';
import { CustomSidebarTrigger } from '@/components/custom-sidebar-trigger';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n';

type AppHeaderProps = {
  role: DashboardRole;
  userName: string;
  userEmail?: string;
};

export function AppHeader({ role, userName, userEmail }: AppHeaderProps) {
  const pathname = usePathname() ?? '';
  const { t } = useTranslation();
  const breadcrumbs = getDashboardBreadcrumbs(role, pathname).map((item) => ({
    ...item,
    label: item.titleKey ? t(item.titleKey) : item.title ?? '',
  }));
  const activityHref = role === 'admin' ? '/admin/bookings' : '/customer/history';

  return (
    <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 border-b bg-white/95 px-4 backdrop-blur dark:bg-background/95 md:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <CustomSidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <AppBreadcrumbs items={breadcrumbs} />
      </div>
      <div className="flex items-center gap-2">
        <Button asChild aria-label={t('common.openActivity')} size="icon" variant="ghost">
          <Link href={activityHref}><Bell /></Link>
        </Button>
        <Separator orientation="vertical" className="h-4" />
        <NavUser name={userName} email={userEmail} role={role} />
      </div>
    </header>
  );
}
