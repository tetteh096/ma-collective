'use client';

import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import '@neondatabase/neon-js/ui/css';
import { authClient } from '@/lib/auth';

// Auth pages get their OWN provider.
// Disable the library's built-in navigation callbacks so only the
// manual useEffect inside the page component controls redirects,
// which prevents a double-redirect race condition.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      emailOTP
      authClient={authClient}
      replace={() => {}}
      navigate={() => {}}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
