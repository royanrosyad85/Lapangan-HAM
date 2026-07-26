'use client';

import Link from 'next/link';

import type { SidebarNavGroup } from '@/components/app-shared';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslation } from '@/lib/i18n';

export function NavGroup({ labelKey, items }: SidebarNavGroup) {
  const { t } = useTranslation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(labelKey)}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton asChild isActive={item.isActive} tooltip={t(item.titleKey)}>
              <Link href={item.path}>
                <item.icon />
                <span>{t(item.titleKey)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
