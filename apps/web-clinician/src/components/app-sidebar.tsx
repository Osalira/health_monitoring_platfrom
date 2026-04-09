'use client';

import { useTranslations } from 'next-intl';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { cn, Button } from '@t1d/ui';
import { Link, usePathname } from '@/i18n/navigation';

interface NavItem {
  href: string;
  labelKey: 'dashboard' | 'patients' | 'settings';
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/patients', labelKey: 'patients', icon: Users },
  { href: '/settings', labelKey: 'settings', icon: Settings },
];

export function AppSidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r bg-background md:block">
      <nav className="flex flex-col gap-1 p-4" aria-label={t('dashboard')}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn('justify-start gap-3', isActive && 'font-semibold')}
              asChild
            >
              <Link href={item.href} aria-current={isActive ? 'page' : undefined}>
                <item.icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b bg-background p-2 md:hidden" aria-label={t('dashboard')}>
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

        return (
          <Button
            key={item.href}
            variant={isActive ? 'secondary' : 'ghost'}
            size="sm"
            className={cn('gap-2', isActive && 'font-semibold')}
            asChild
          >
            <Link href={item.href} aria-current={isActive ? 'page' : undefined}>
              <item.icon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">{t(item.labelKey)}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
