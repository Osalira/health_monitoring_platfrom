'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button, Input, Badge } from '@t1d/ui';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

interface StaffUser {
  id: string;
  displayName: string;
  role: string;
}

interface CreateTaskDialogProps {
  patientId: string;
}

export function CreateTaskDialog({ patientId }: CreateTaskDialogProps) {
  const t = useTranslations('patientDetail.taskForm');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>('MEDIUM');
  const [assignedToUserId, setAssignedToUserId] = useState('');
  const [users, setUsers] = useState<StaffUser[]>([]);

  useEffect(() => {
    if (open && users.length === 0) {
      fetch('/api/users')
        .then((r) => r.json())
        .then((data: StaffUser[]) => setUsers(data))
        .catch(() => {});
    }
  }, [open, users.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const body: Record<string, string> = { patientId, title, priority };
      if (description) body['description'] = description;
      if (assignedToUserId) body['assignedToUserId'] = assignedToUserId;

      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setAssignedToUserId('');
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-3 w-3" /> {t('addTask')}
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border bg-card p-3">
      <Input
        placeholder={t('titlePlaceholder')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        aria-label={t('titlePlaceholder')}
      />
      <Input
        placeholder={t('descriptionPlaceholder')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label={t('descriptionPlaceholder')}
      />
      {users.length > 0 && (
        <select
          value={assignedToUserId}
          onChange={(e) => setAssignedToUserId(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('assignTo')}
        >
          <option value="">{t('unassigned')}</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.displayName}
            </option>
          ))}
        </select>
      )}
      <div className="flex flex-wrap gap-1">
        {PRIORITIES.map((p) => (
          <Badge
            key={p}
            variant={priority === p ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setPriority(p)}
          >
            {t(`priority.${p}`)}
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading || !title.trim()}>
          {loading ? t('creating') : t('create')}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
