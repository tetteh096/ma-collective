'use client';

import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import '@neondatabase/neon-js/ui/css';
import { authClient } from '@/lib/auth';
import { ThemeProvider } from './context/ThemeContext';

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    // replace is a no-op here — AdminShell handles all redirects manually
    // This prevents NeonAuthUIProvider from intercepting pages and creating redirect loops
    <NeonAuthUIProvider
      emailOTP
      authClient={authClient}
      replace={() => {}}
      navigate={() => {}}
    >
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </NeonAuthUIProvider>
  );
}
