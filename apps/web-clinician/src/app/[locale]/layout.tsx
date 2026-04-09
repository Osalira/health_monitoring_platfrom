import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers';
import { AppShell } from '@/components/app-shell';
import { SiteHeader } from '@/components/site-header';
import '@/app/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  const cookieStore = await cookies();
  const activeUserId = cookieStore.get('t1d_demo_user')?.value;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <AppShell
              initialUserId={activeUserId}
              header={({ currentUser, onSwitchUser }) => (
                <SiteHeader
                  currentUser={currentUser}
                  onSwitchUser={onSwitchUser}
                />
              )}
            >
              {children}
            </AppShell>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
