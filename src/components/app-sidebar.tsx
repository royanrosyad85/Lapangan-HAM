'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarPlus, ListFilter } from 'lucide-react';

import { getDashboardNavGroups, type DashboardRole } from '@/components/app-shared';
import { NavGroup } from '@/components/nav-group';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useTranslation } from '@/lib/i18n';

type AppSidebarProps = {
  role: DashboardRole;
};

export function AppSidebar({ role }: AppSidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname() ?? '';
  const groups = getDashboardNavGroups(role, pathname);
  const home = role === 'admin' ? '/admin' : '/customer';
  const primaryAction = role === 'admin'
    ? { href: '/admin/fields/create', label: t('admin.addFieldAction') }
    : { href: '/customer/booking/create', label: t('dashboard.newBooking') };
  const listAction = role === 'admin' ? '/admin/bookings' : '/customer/history';

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href={home} aria-label="HAM Stadium">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
                  <Image src="/assets/Logo-HAM-fix.png" alt="" width={22} height={22} priority className="size-5 object-contain" />
                </span>
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold">HAM Stadium</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {role === 'admin' ? t('common.adminPanel') : t('common.customerPortal')}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton asChild tooltip={primaryAction.label} className="min-w-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
              <Link href={primaryAction.href}>
                <CalendarPlus />
                <span>{primaryAction.label}</span>
              </Link>
            </SidebarMenuButton>
            <Button
              asChild
              aria-label={role === 'admin' ? t('admin.bookingList') : t('nav.history')}
              className="size-8 group-data-[collapsible=icon]:hidden"
              size="icon"
              variant="outline"
            >
              <Link href={listAction}>
                <ListFilter />
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => <NavGroup key={group.labelKey} {...group} />)}
      </SidebarContent>
      <SidebarFooter>
        <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Stadion H. Abdul Malik
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
