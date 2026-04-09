'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Phone, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from '@t1d/ui';
import { formatRelativeTime } from '@/lib/format';

const LOG_TYPES = ['phone', 'email', 'visit', 'message', 'other'] as const;

interface OutreachPanelProps {
  patientId: string;
  logs: {
    id: string;
    type: string;
    note: string;
    contactedAt: Date;
    author: { displayName: string } | null;
  }[];
}

export function OutreachPanel({ patientId, logs }: OutreachPanelProps) {
  const t = useTranslations('patientDetail.outreach');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<(typeof LOG_TYPES)[number]>('phone');
  const [note, setNote] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, type, note }),
      });
      setNote('');
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {t('title')}
          </span>
          {logs.length > 0 && <Badge variant="outline">{logs.length}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 && !open && (
          <p className="py-4 text-center text-sm text-muted-foreground">{t('noLogs')}</p>
        )}
        {logs.length > 0 && (
          <div className="space-y-2 text-sm">
            {logs.map((log) => (
              <div key={log.id} className="border-b pb-2 last:border-0">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{t(`type.${log.type}`)}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(log.contactedAt)}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{log.note}</p>
                {log.author && (
                  <p className="text-xs text-muted-foreground">— {log.author.displayName}</p>
                )}
              </div>
            ))}
          </div>
        )}
        {open ? (
          <form onSubmit={handleSubmit} className="mt-3 space-y-2 rounded-lg border bg-card p-3">
            <div className="flex gap-1">
              {LOG_TYPES.map((lt) => (
                <Badge
                  key={lt}
                  variant={type === lt ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setType(lt)}
                >
                  {t(`type.${lt}`)}
                </Badge>
              ))}
            </div>
            <Input
              placeholder={t('notePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              aria-label={t('notePlaceholder')}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={loading || !note.trim()}>
                {loading ? t('saving') : t('save')}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                {t('cancel')}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-3 w-3" /> {t('addLog')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
