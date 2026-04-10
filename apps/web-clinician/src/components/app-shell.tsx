'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar, MobileNav } from './app-sidebar';
import { SiteHeader } from './site-header';

interface AppShellProps {
  userName?: string | undefined;
  userRole?: string | undefined;
  userEmail?: string | undefined;
  children: React.ReactNode;
}

export function AppShell({ userName, userRole, userEmail, children }: AppShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes('/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader userName={userName} userRole={userRole} userEmail={userEmail} />
      <MobileNav />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
