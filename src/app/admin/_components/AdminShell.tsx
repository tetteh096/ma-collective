'use client';

import { useAuthenticate } from '@neondatabase/neon-js/auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface Props {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

function AuthGuard({ title, children, actions }: Props) {
  const { data: user, isPending } = useAuthenticate();
  const router = useRouter();
  // Track whether we've seen at least one pending→resolved cycle so we
  // don't redirect on the very first render when the provider hasn't
  // yet had a chance to hydrate the auth state from the stored session.
  const wasEverPending = useRef(false);

  useEffect(() => {
    if (isPending) {
      wasEverPending.current = true;
    }
    // Only redirect after the auth check has genuinely completed
    if (wasEverPending.current && !isPending && !user) {
      router.replace('/auth/sign-in?redirectTo=/admin');
    }
  }, [user, isPending, router]);

  if (isPending) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="ad-shell">
      <Sidebar />
      <div className="ad-main">
        <Topbar title={title} actions={actions} />
        <main className="ad-content">{children}</main>
      </div>
    </div>
  );
}

export default function AdminShell(props: Props) {
  return <AuthGuard {...props} />;
}
