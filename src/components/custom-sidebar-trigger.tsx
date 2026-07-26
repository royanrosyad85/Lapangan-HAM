'use client';

import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/lib/i18n';

export function CustomSidebarTrigger() {
  const { t } = useTranslation();
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger asChild>
        <SidebarTrigger />
      </TooltipTrigger>
      <TooltipContent side="right">
        {t('common.toggleSidebar')} <KbdGroup><Kbd>⌘</Kbd><Kbd>B</Kbd></KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}
