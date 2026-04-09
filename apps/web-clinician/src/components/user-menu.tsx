'use client';

import { useTranslations } from 'next-intl';
import { User, ChevronDown } from 'lucide-react';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@t1d/ui';
import { DEMO_USERS, type MockUser } from '@t1d/auth';

interface UserMenuProps {
  currentUser: MockUser;
  onSwitchUser: (userId: string) => void;
}

export function UserMenu({ currentUser, onSwitchUser }: UserMenuProps) {
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 px-2"
          aria-label={t('auth.currentUser')}
        >
          <User className="h-4 w-4" />
          <span className="hidden text-sm sm:inline">{currentUser.displayName}</span>
          <Badge variant="outline" className="hidden text-xs sm:inline-flex">
            {t(`roles.${currentUser.role}`)}
          </Badge>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('auth.switchUser')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {DEMO_USERS.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => onSwitchUser(user.id)}
            className={currentUser.id === user.id ? 'bg-accent' : ''}
          >
            <div className="flex flex-col">
              <span className="text-sm">{user.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {t(`roles.${user.role}`)}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
