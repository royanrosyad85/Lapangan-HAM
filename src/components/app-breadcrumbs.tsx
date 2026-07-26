import Link from 'next/link';
import { Fragment } from 'react';

import type { DashboardBreadcrumb } from '@/components/app-shared';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function AppBreadcrumbs({ items }: { items: (DashboardBreadcrumb & { label: string })[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.path ?? item.label}>
              {index > 0 && <BreadcrumbSeparator className="hidden sm:block" />}
              <BreadcrumbItem className={isLast ? '' : 'hidden sm:inline-flex'}>
                {isLast ? (
                  <BreadcrumbPage className="max-w-40 truncate capitalize">{item.label}</BreadcrumbPage>
                ) : item.path ? (
                  <BreadcrumbLink asChild><Link href={item.path}>{item.label}</Link></BreadcrumbLink>
                ) : (
                  <span className="max-w-40 truncate text-muted-foreground">{item.label}</span>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
