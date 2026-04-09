'use client';

import { useState, useCallback } from 'react';
import { DEFAULT_USER, findUserById, type MockUser } from '@t1d/auth';
import { AppSidebar, MobileNav } from './app-sidebar';

interface AppShellProps {
  initialUserId?: string | undefined;
  header: (props: { currentUser: MockUser; onSwitchUser: (id: string) => void }) => React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ initialUserId, header, children }: AppShellProps) {
  const [currentUser, setCurrentUser] = useState<MockUser>(
    () => (initialUserId ? findUserById(initialUserId) : undefined) ?? DEFAULT_USER,
  );

  const handleSwitchUser = useCallback((userId: string) => {
    const user = findUserById(userId);
    if (user) {
      setCurrentUser(user);
      // Store in cookie for server-side access (demo only)
      document.cookie = `t1d_demo_user=${userId};path=/;max-age=86400`;
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      {header({ currentUser, onSwitchUser: handleSwitchUser })}
      <MobileNav />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
