'use client';

import { ChevronsUpDown, LogOut } from 'lucide-react';

import type { DashboardRole } from '@/components/app-shared';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n';

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts.at(-1)?.[0] ?? ''}`.toUpperCase();
}

type NavUserProps = {
  name: string;
  email?: string;
  role: DashboardRole;
};

export function NavUser({ name, email, role }: NavUserProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t('common.accountMenu', { name })} className="flex min-h-10 items-center gap-2 rounded-md px-1.5 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-8 rounded-md">
          <AvatarFallback className="rounded-md text-xs font-medium">{initialsOf(name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-36 truncate text-sm font-medium sm:block">{name}</span>
        <ChevronsUpDown className="hidden text-muted-foreground sm:block" size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium">{name}</span>
          <span className="block truncate text-xs text-muted-foreground">{email ?? (role === 'admin' ? t('admin.administrator') : t('common.customer'))}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <span className="text-xs text-muted-foreground">{t('common.theme')}</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <span className="text-xs text-muted-foreground">{t('common.language')}</span>
          <LanguageToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="flex w-full items-center gap-2">
              <LogOut />
              {t('common.logout')}
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
