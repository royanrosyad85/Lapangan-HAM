import type { LucideIcon } from 'lucide-react';
import { CalendarDays, History, LayoutDashboard, MapPin } from 'lucide-react';

export type DashboardRole = 'admin' | 'customer';

export type SidebarNavItem = {
  titleKey: string;
  path: string;
  icon: LucideIcon;
  exact?: boolean;
  isActive?: boolean;
};

export type SidebarNavGroup = {
  labelKey: string;
  items: SidebarNavItem[];
};

export type DashboardBreadcrumb = {
  title?: string;
  titleKey?: string;
  path?: string;
};

const NAV_GROUPS: Record<DashboardRole, SidebarNavGroup[]> = {
  admin: [
    {
      labelKey: 'common.overview',
      items: [
        { titleKey: 'admin.dashboardTitle', path: '/admin', icon: LayoutDashboard, exact: true },
      ],
    },
    {
      labelKey: 'common.management',
      items: [
        { titleKey: 'nav.fieldDetails', path: '/admin/fields', icon: MapPin },
        { titleKey: 'nav.booking', path: '/admin/bookings', icon: CalendarDays },
      ],
    },
  ],
  customer: [
    {
      labelKey: 'common.overview',
      items: [
        { titleKey: 'nav.dashboard', path: '/customer', icon: LayoutDashboard, exact: true },
      ],
    },
    {
      labelKey: 'nav.booking',
      items: [
        { titleKey: 'nav.booking', path: '/customer/booking/create', icon: CalendarDays },
        { titleKey: 'nav.history', path: '/customer/history', icon: History },
      ],
    },
  ],
};

export function getDashboardNavGroups(role: DashboardRole, pathname: string): SidebarNavGroup[] {
  return NAV_GROUPS[role].map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: item.exact
        ? pathname === item.path
        : pathname === item.path || pathname.startsWith(`${item.path}/`),
    })),
  }));
}

export function getDashboardBreadcrumbs(role: DashboardRole, pathname: string): DashboardBreadcrumb[] {
  const root = role === 'admin'
    ? { titleKey: 'admin.dashboardTitle', path: '/admin' }
    : { titleKey: 'nav.dashboard', path: '/customer' };

  if (pathname === root.path) return [root];

  if (role === 'admin' && pathname.startsWith('/admin/fields')) {
    const crumbs: DashboardBreadcrumb[] = [root, { titleKey: 'nav.fieldDetails', path: '/admin/fields' }];
    const detail = pathname.slice('/admin/fields/'.length).split('/').filter(Boolean);
    if (detail[0] === 'create') return [...crumbs, { titleKey: 'admin.addFieldTitle' }];
    if (detail[0]) crumbs.push({ title: `#${detail[0]}` });
    if (detail[1] === 'edit') crumbs.push({ titleKey: 'common.edit' });
    return crumbs;
  }

  if (role === 'admin' && pathname.startsWith('/admin/bookings')) {
    return [root, { titleKey: 'nav.booking' }];
  }

  if (pathname === '/customer/booking/create') {
    return [root, { titleKey: 'booking.heading' }];
  }

  if (pathname.startsWith('/customer/booking/') && pathname.endsWith('/pelunasan')) {
    const bookingId = pathname.split('/')[3];
    return [
      root,
      { titleKey: 'nav.history', path: '/customer/history' },
      { title: `#${bookingId}` },
      { titleKey: 'payment.title' },
    ];
  }

  if (pathname.startsWith('/customer/history')) {
    return [root, { titleKey: 'nav.history' }];
  }

  return [root];
}
