'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LogOut, User } from 'lucide-react';
import { Badge, Button, Separator } from '@t1d/ui';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';

interface SiteHeaderProps {
  userName?: string | undefined;
  userRole?: string | undefined;
  userEmail?: string | undefined;
}

export function SiteHeader({ userName, userRole, userEmail }: SiteHeaderProps) {
  const t = useTranslations();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    // Hard redirect to force middleware to catch the unauthenticated state
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="mr-4 flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            {t('dashboard.title')}
          </span>
          <Badge variant="outline" className="text-xs">
            {t('auth.syntheticData')}
          </Badge>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {userName && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="hidden text-sm sm:inline">{userName}</span>
              {userRole && (
                <Badge variant="secondary" className="hidden text-xs sm:inline-flex">
                  {t(`roles.${userRole.toLowerCase()}`)}
                </Badge>
              )}
            </div>
          )}
          <Separator orientation="vertical" className="mx-1 h-6" />
          <LocaleSwitcher />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <ThemeToggle />
          {userEmail && (
            <>
              <Separator orientation="vertical" className="mx-1 h-6" />
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label={t('auth.logout')}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
