import { describe, expect, it } from 'vitest';

import { getDashboardBreadcrumbs, getDashboardNavGroups } from './app-shared';

describe('getDashboardNavGroups', () => {
  it('returns only admin routes and marks the matching section active', () => {
    const groups = getDashboardNavGroups('admin', '/admin/fields/12/edit');
    const items = groups.flatMap((group) => group.items);

    expect(items.map((item) => item.path)).toEqual([
      '/admin',
      '/admin/fields',
      '/admin/bookings',
    ]);
    expect(items.find((item) => item.path === '/admin/fields')?.isActive).toBe(true);
    expect(items.some((item) => item.path.startsWith('/customer'))).toBe(false);
  });

  it('returns only customer routes and keeps the dashboard match exact', () => {
    const groups = getDashboardNavGroups('customer', '/customer/history');
    const items = groups.flatMap((group) => group.items);

    expect(items.map((item) => item.path)).toEqual([
      '/customer',
      '/customer/booking/create',
      '/customer/history',
    ]);
    expect(items.find((item) => item.path === '/customer')?.isActive).toBe(false);
    expect(items.find((item) => item.path === '/customer/history')?.isActive).toBe(true);
    expect(items.some((item) => item.path.startsWith('/admin'))).toBe(false);
  });
});

describe('getDashboardBreadcrumbs', () => {
  it('keeps admin ancestors and labels dynamic edit routes', () => {
    expect(getDashboardBreadcrumbs('admin', '/admin/fields/12/edit')).toEqual([
      { titleKey: 'admin.dashboardTitle', path: '/admin' },
      { titleKey: 'nav.fieldDetails', path: '/admin/fields' },
      { title: '#12' },
      { titleKey: 'common.edit' },
    ]);
  });

  it('labels customer payment routes without exposing raw segments', () => {
    expect(getDashboardBreadcrumbs('customer', '/customer/booking/7/pelunasan')).toEqual([
      { titleKey: 'nav.dashboard', path: '/customer' },
      { titleKey: 'nav.history', path: '/customer/history' },
      { title: '#7' },
      { titleKey: 'payment.title' },
    ]);
  });
});
