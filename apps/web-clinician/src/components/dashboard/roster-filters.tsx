'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { Input, Button } from '@t1d/ui';

const RISK_TIERS = ['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const;
const DEBOUNCE_MS = 300;

export function RosterFilters() {
  const t = useTranslations('dashboard.roster');
  const tRisk = useTranslations('dashboard.riskTiers');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('search') ?? '';
  const currentRisk = searchParams.get('risk') ?? 'ALL';

  // Debounced search
  const [searchValue, setSearchValue] = useState(currentSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'ALL' && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 on filter change
      params.delete('page');
      startTransition(() => {
        router.replace(`?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateParams('search', searchValue);
      }
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue, currentSearch, updateParams]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9"
          aria-label={t('searchPlaceholder')}
        />
      </div>
      <div className="flex gap-1">
        {RISK_TIERS.map((tier) => (
          <Button
            key={tier}
            variant={currentRisk === tier ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateParams('risk', tier)}
            disabled={isPending}
          >
            {tRisk(tier)}
          </Button>
        ))}
      </div>
    </div>
  );
}
