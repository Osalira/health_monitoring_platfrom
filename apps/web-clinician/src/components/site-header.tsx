import { useTranslations } from 'next-intl';
import { Separator } from '@t1d/ui';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';

export function SiteHeader() {
  const t = useTranslations('dashboard');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <span className="text-lg font-bold text-foreground">{t('title')}</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LocaleSwitcher />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
