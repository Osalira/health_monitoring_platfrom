'use client';

import { useTranslations } from 'next-intl';
import { Badge, Separator } from '@t1d/ui';
import type { MockUser } from '@t1d/auth';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';
import { UserMenu } from './user-menu';

interface SiteHeaderProps {
  currentUser: MockUser;
  onSwitchUser: (userId: string) => void;
}

export function SiteHeader({ currentUser, onSwitchUser }: SiteHeaderProps) {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="mr-4 flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            {t('dashboard.title')}
          </span>
          <Badge variant="outline" className="text-xs">
            {t('auth.demoMode')}
          </Badge>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <UserMenu currentUser={currentUser} onSwitchUser={onSwitchUser} />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <LocaleSwitcher />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
