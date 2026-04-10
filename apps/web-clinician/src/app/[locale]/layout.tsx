import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers';
import { AppShell } from '@/components/app-shell';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@t1d/database';
import { validateEnv } from '@/lib/env';
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
  validateEnv();

  const messages = await getMessages();

  // Resolve user info for the shell header (best-effort, never blocks rendering)
  let userName: string | undefined;
  let userRole: string | undefined;
  let userEmail: string | undefined;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (supabaseUser?.email) {
      userEmail = supabaseUser.email;
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: supabaseUser.email },
          select: { displayName: true, role: true, email: true },
        });
        if (dbUser) {
          userName = dbUser.displayName;
          userRole = dbUser.role;
        } else {
          userName = supabaseUser.email;
        }
      } catch {
        userName = supabaseUser.email;
      }
    }
  } catch {
    // Supabase not available — proceed without user info
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <AppShell userName={userName} userRole={userRole} userEmail={userEmail}>
              {children}
            </AppShell>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
