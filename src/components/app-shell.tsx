import type { DashboardRole } from '@/components/app-shared';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

type AppShellProps = {
  role: DashboardRole;
  userName: string;
  userEmail?: string;
  children: React.ReactNode;
};

export function AppShell({ role, userName, userEmail, children }: AppShellProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar role={role} />
        <SidebarInset className="min-w-0 bg-white font-sans dark:bg-background">
          <AppHeader role={role} userName={userName} userEmail={userEmail} />
          <div className="flex flex-1 flex-col p-4 md:p-5">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
