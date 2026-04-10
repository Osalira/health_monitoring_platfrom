'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@t1d/ui';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const DEMO_ACCOUNTS = [
  { email: 'clinician@t1d-demo.app', password: 'demo-clinician-2026', role: 'Clinician' },
  { email: 'educator@t1d-demo.app', password: 'demo-educator-2026', role: 'Educator' },
  { email: 'admin@t1d-demo.app', password: 'demo-admin-2026', role: 'Admin' },
];

export function LoginForm() {
  const t = useTranslations('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        console.error('[login] Supabase auth error:', authError.message);
        setError(authError.message || t('invalidCredentials'));
        return;
      }

      // Hard redirect so the server layout re-executes and resolves the user
      window.location.href = '/';
    } catch (e) {
      console.error('[login] Unexpected error:', e);
      setError(t('unexpectedError'));
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(account: (typeof DEMO_ACCOUNTS)[number]) {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label={t('emailPlaceholder')}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label={t('passwordPlaceholder')}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('signingIn') : t('signIn')}
            </Button>
          </form>

          <div className="mt-6 border-t pt-4">
            <p className="mb-3 text-center text-sm text-muted-foreground">{t('demoAccounts')}</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{account.role}</span>
                  <span className="text-muted-foreground">{account.email}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
